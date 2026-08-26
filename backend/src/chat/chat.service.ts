import { createOpenAI } from '@ai-sdk/openai';
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  CHAT_REPLY_STATUS,
  HEALTH_DAILY_MAX_RANGE_DAYS,
  resolveAppLocale,
  type AppLocale,
  type ChatRequest,
  type ChatResponse,
} from '@syna/shared-types';
import { generateText, Output, stepCountIs, tool } from 'ai';
import { z } from 'zod';

import { AssessmentsService } from '../assessments/assessments.service';
import type { AuthenticatedClerkUser } from '../auth/auth.types';
import { CycleService } from '../cycle/cycle.service';
import { HealthDailyService } from '../health-daily/health-daily.service';
import { MoodService } from '../mood/mood.service';
import { PeriodService } from '../period/period.service';
import { SymptomsService } from '../symptoms/symptoms.service';
import { UsersService } from '../users/users.service';

import { parseChatEnv } from './chat.config';
import {
  buildSynaChatSystemPrompt,
  SYNA_CHAT_EMPTY_DATA_NOTE,
  synaChatFallbackReply,
} from './chat.prompt';

const IsoDateInputSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
  .describe('ISO calendar date YYYY-MM-DD');

const ChatStructuredOutputSchema = z.object({
  status: z
    .enum([
      CHAT_REPLY_STATUS.ok,
      CHAT_REPLY_STATUS.invalidQuestion,
      CHAT_REPLY_STATUS.noData,
    ])
    .describe(
      'ok = grounded answer; invalid_question = off-topic; no_data = on-topic but empty tools',
    ),
  reply: z
    .string()
    .min(1)
    .describe('User-facing reply in the appropriate language'),
});

const todayUtcDateKey = (): string => new Date().toISOString().slice(0, 10);

const shiftDateKey = (dateKey: string, deltaDays: number): string => {
  const date = new Date(`${dateKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + deltaDays);
  return date.toISOString().slice(0, 10);
};

const pickRecentDateKeys = (
  dateKeys: string[],
  limit: number,
): string[] => [...dateKeys].sort().slice(-limit);

const filterRecordByDateKeys = <T>(
  record: Record<string, T>,
  dateKeys: string[],
): Record<string, T> => {
  const allowed = new Set(dateKeys);
  const filtered: Record<string, T> = {};

  for (const [dateKey, value] of Object.entries(record)) {
    if (allowed.has(dateKey)) {
      filtered[dateKey] = value;
    }
  }

  return filtered;
};

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly periodService: PeriodService,
    private readonly moodService: MoodService,
    private readonly symptomsService: SymptomsService,
    private readonly healthDailyService: HealthDailyService,
    private readonly cycleService: CycleService,
    private readonly assessmentsService: AssessmentsService,
    private readonly usersService: UsersService,
  ) {}

  async chat(
    clerkUser: AuthenticatedClerkUser,
    input: ChatRequest,
  ): Promise<ChatResponse> {
    let env: ReturnType<typeof parseChatEnv>;

    try {
      env = parseChatEnv();
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error.message : 'Chat configuration invalid',
      );
      throw new ServiceUnavailableException(
        'SYNA chat is not configured. Set OPENAI_API_KEY on the backend.',
      );
    }

    // Resolve the authenticated Syna user once. All tools close over clerkUser
    // (never a client-supplied user id), so rows stay scoped to this account.
    const user = await this.usersService.ensureCurrentUser(clerkUser);
    const locale: AppLocale = resolveAppLocale(input.locale ?? user.locale);

    const openai = createOpenAI({ apiKey: env.OPENAI_API_KEY });
    const tools = this.buildTools(clerkUser);

    try {
      const result = await generateText({
        model: openai(env.OPENAI_MODEL),
        system: buildSynaChatSystemPrompt({ locale }),
        messages: input.messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        tools,
        stopWhen: stepCountIs(6),
        temperature: 0.2,
        output: Output.object({
          name: 'SynaChatReply',
          description:
            'Structured SYNA chat reply with status (ok | invalid_question | no_data) and reply text',
          schema: ChatStructuredOutputSchema,
        }),
      });

      const structured = result.output;

      if (!structured?.reply?.trim()) {
        return {
          status: CHAT_REPLY_STATUS.noData,
          reply: synaChatFallbackReply('no_data', locale),
        };
      }

      return {
        status: structured.status,
        reply: structured.reply.trim(),
      };
    } catch (error) {
      this.logger.error(
        'OpenAI chat generation failed',
        error instanceof Error ? error.stack : String(error),
      );
      throw new ServiceUnavailableException(
        synaChatFallbackReply('unavailable', locale),
      );
    }
  }

  /**
   * Tools always execute with the authenticated Clerk user from the request.
   * The model cannot pass another user id.
   */
  private buildTools(clerkUser: AuthenticatedClerkUser) {
    return {
      get_period_days: tool({
        description:
          'List menstrual period days this user logged (YYYY-MM-DD). Own account only.',
        inputSchema: z.object({
          recentLimit: z
            .number()
            .int()
            .min(1)
            .max(120)
            .optional()
            .describe('Optional cap on most recent period days to return'),
        }),
        execute: async ({ recentLimit }) => {
          const { dateKeys } = await this.periodService.listDays(clerkUser);

          if (dateKeys.length === 0) {
            return { dateKeys: [], note: SYNA_CHAT_EMPTY_DATA_NOTE };
          }

          const limited = recentLimit
            ? pickRecentDateKeys(dateKeys, recentLimit)
            : dateKeys;

          return {
            dateKeys: limited,
            totalLoggedDays: dateKeys.length,
            latestDateKey: pickRecentDateKeys(dateKeys, 1)[0] ?? null,
          };
        },
      }),

      get_cycle_phase: tool({
        description:
          'Current cycle phase snapshot for this user (phase, cycle day, next period estimate).',
        inputSchema: z.object({
          asOfDateKey: IsoDateInputSchema.optional().describe(
            'Optional as-of day; defaults to today UTC',
          ),
        }),
        execute: async ({ asOfDateKey }) => {
          const snapshot = await this.cycleService.getPhaseForClerkUser(
            clerkUser,
            asOfDateKey ?? todayUtcDateKey(),
          );

          if (!snapshot.hasPeriodData) {
            return { ...snapshot, note: SYNA_CHAT_EMPTY_DATA_NOTE };
          }

          return snapshot;
        },
      }),

      get_mood_logs: tool({
        description:
          'Recent mood check-ins for this user keyed by date (mood, feelings, energy, stress, note).',
        inputSchema: z.object({
          recentDays: z
            .number()
            .int()
            .min(1)
            .max(90)
            .optional()
            .describe('How many most recent mood days to include (default 30)'),
        }),
        execute: async ({ recentDays }) => {
          const { logs } = await this.moodService.listLogs(clerkUser);
          const dateKeys = pickRecentDateKeys(
            Object.keys(logs),
            recentDays ?? 30,
          );
          const recentLogs = filterRecordByDateKeys(logs, dateKeys);

          if (dateKeys.length === 0) {
            return { logs: {}, note: SYNA_CHAT_EMPTY_DATA_NOTE };
          }

          return { logs: recentLogs, dayCount: dateKeys.length };
        },
      }),

      get_symptom_logs: tool({
        description:
          'Recent symptom logs for this user keyed by date (symptom id lists).',
        inputSchema: z.object({
          recentDays: z
            .number()
            .int()
            .min(1)
            .max(90)
            .optional()
            .describe('How many most recent symptom days to include (default 30)'),
        }),
        execute: async ({ recentDays }) => {
          const { logs } = await this.symptomsService.listLogs(clerkUser);
          const dateKeys = pickRecentDateKeys(
            Object.keys(logs),
            recentDays ?? 30,
          );
          const recentLogs = filterRecordByDateKeys(logs, dateKeys);

          if (dateKeys.length === 0) {
            return { logs: {}, note: SYNA_CHAT_EMPTY_DATA_NOTE };
          }

          return { logs: recentLogs, dayCount: dateKeys.length };
        },
      }),

      get_health_daily_metrics: tool({
        description:
          'Wearable daily metrics for this user (sleep, resting HR, etc.) for an inclusive date range. Max 90 days.',
        inputSchema: z.object({
          from: IsoDateInputSchema.optional().describe(
            'Inclusive start YYYY-MM-DD; defaults to 30 days before to',
          ),
          to: IsoDateInputSchema.optional().describe(
            'Inclusive end YYYY-MM-DD; defaults to today UTC',
          ),
        }),
        execute: async ({ from, to }) => {
          const toDate = to ?? todayUtcDateKey();
          const fromDate = from ?? shiftDateKey(toDate, -29);

          const metrics = await this.healthDailyService.listDaily(clerkUser, {
            from: fromDate,
            to: toDate,
          });

          if (metrics.rows.length === 0) {
            return {
              from: fromDate,
              to: toDate,
              platform: metrics.platform,
              rows: [],
              note: SYNA_CHAT_EMPTY_DATA_NOTE,
              maxRangeDays: HEALTH_DAILY_MAX_RANGE_DAYS,
            };
          }

          return {
            from: fromDate,
            to: toDate,
            platform: metrics.platform,
            rows: metrics.rows,
          };
        },
      }),

      get_latest_assessments: tool({
        description:
          'Latest MRS-II, PHQ-2, and PAM-13 summaries for this user, if completed.',
        inputSchema: z.object({}),
        execute: async () => {
          const [mrsIi, phq2, pam13] = await Promise.all([
            this.assessmentsService.getLatestMrsIi(clerkUser),
            this.assessmentsService.getLatestPhq2(clerkUser),
            this.assessmentsService.getLatestPam13(clerkUser),
          ]);

          const hasAny = Boolean(
            mrsIi.submission || phq2.submission || pam13.submission,
          );

          if (!hasAny) {
            return {
              mrsIi,
              phq2,
              pam13,
              note: SYNA_CHAT_EMPTY_DATA_NOTE,
            };
          }

          return { mrsIi, phq2, pam13 };
        },
      }),

      get_user_profile_snapshot: tool({
        description:
          'Privacy-safe profile snapshot for this user (name, DOB, locale, health metrics, health record). Omits email and ids.',
        inputSchema: z.object({}),
        execute: async () => {
          const profile = await this.usersService.ensureCurrentUser(clerkUser);
          const healthRecord = profile.healthRecord;
          const hasHealthRecord = Boolean(
            healthRecord &&
              (healthRecord.labs !== null ||
                healthRecord.medications.length > 0 ||
                (healthRecord.concerns?.trim().length ?? 0) > 0),
          );

          return {
            firstName: profile.firstName,
            lastName: profile.lastName,
            dateOfBirth: profile.dateOfBirth,
            locale: profile.locale,
            isBioComplete: profile.isBioComplete,
            healthMetrics: profile.healthMetrics,
            healthRecord: profile.healthRecord,
            hasHealthRecord,
            note:
              !hasHealthRecord && !profile.healthMetrics
                ? SYNA_CHAT_EMPTY_DATA_NOTE
                : undefined,
          };
        },
      }),
    };
  }
}
