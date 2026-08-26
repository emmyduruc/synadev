import { createOpenAI } from '@ai-sdk/openai';
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  HEALTH_DAILY_MAX_RANGE_DAYS,
  type ChatRequest,
  type ChatResponse,
} from '@syna/shared-types';
import { generateText, stepCountIs, tool } from 'ai';
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

const IsoDateInputSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
  .describe('ISO calendar date YYYY-MM-DD');

const EMPTY_DATA_NOTE =
  'No matching data found in this user account for this query.';

const SYSTEM_PROMPT = `You are SYNA, a warm wellness companion inside the SYNA health app.
Answer only with facts returned by the tools about this authenticated user's own data.
Never invent dates, scores, labs, medications, symptoms, sleep, heart rate, or period days.
If tools return empty results or explicitly say no data was found, apologize clearly that no matching data was found in their SYNA account for that question. Suggest they log it in the app when that would help.
Do not diagnose medical conditions. For medical concerns, gently suggest speaking with a clinician.
Keep answers concise, concrete, and friendly. Prefer real dates and numbers from tool results.
Respond in the same language the user used in their latest message.`;

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

    const openai = createOpenAI({ apiKey: env.OPENAI_API_KEY });
    const tools = this.buildTools(clerkUser);

    try {
      const result = await generateText({
        model: openai(env.OPENAI_MODEL),
        system: SYSTEM_PROMPT,
        messages: input.messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        tools,
        stopWhen: stepCountIs(6),
        temperature: 0.3,
      });

      const reply = result.text.trim();

      if (!reply) {
        return {
          reply:
            "I'm sorry. No matching data was found in your SYNA account for that question.",
        };
      }

      return { reply };
    } catch (error) {
      this.logger.error(
        'OpenAI chat generation failed',
        error instanceof Error ? error.stack : String(error),
      );
      throw new ServiceUnavailableException(
        'SYNA chat is temporarily unavailable. Please try again shortly.',
      );
    }
  }

  private buildTools(clerkUser: AuthenticatedClerkUser) {
    return {
      get_period_days: tool({
        description:
          'List menstrual period days the user has logged (YYYY-MM-DD). Use for last period, period history, or bleeding days.',
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
            return { dateKeys: [], note: EMPTY_DATA_NOTE };
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
          'Get the current estimated cycle phase snapshot (phase, cycle day, next period estimate).',
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
            return { ...snapshot, note: EMPTY_DATA_NOTE };
          }

          return snapshot;
        },
      }),

      get_mood_logs: tool({
        description:
          'Get recent mood check-ins keyed by date (primary mood, feelings, energy, stress, note).',
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
            return { logs: {}, note: EMPTY_DATA_NOTE };
          }

          return { logs: recentLogs, dayCount: dateKeys.length };
        },
      }),

      get_symptom_logs: tool({
        description:
          'Get recent symptom logs keyed by date (symptom id lists).',
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
            return { logs: {}, note: EMPTY_DATA_NOTE };
          }

          return { logs: recentLogs, dayCount: dateKeys.length };
        },
      }),

      get_health_daily_metrics: tool({
        description:
          'Get wearable daily metrics (sleep stages, resting HR, etc.) for an inclusive date range. Max 90 days.',
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
              note: EMPTY_DATA_NOTE,
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
          'Get the latest MRS-II, PHQ-2, and PAM-13 assessment summaries if the user has completed them.',
        inputSchema: z.object({}),
        execute: async () => {
          const [mrsIi, phq2, pam13] = await Promise.all([
            this.assessmentsService.getLatestMrsIi(clerkUser),
            this.assessmentsService.getLatestPhq2(clerkUser),
            this.assessmentsService.getLatestPam13(clerkUser),
          ]);

          const hasAny = Boolean(mrsIi.submission || phq2.submission || pam13.submission);

          if (!hasAny) {
            return {
              mrsIi,
              phq2,
              pam13,
              note: EMPTY_DATA_NOTE,
            };
          }

          return { mrsIi, phq2, pam13 };
        },
      }),

      get_user_profile_snapshot: tool({
        description:
          'Get a privacy-safe profile snapshot: name, DOB, locale, health metrics summary, and health record (labs, meds, concerns). Omits email and ids.',
        inputSchema: z.object({}),
        execute: async () => {
          const user = await this.usersService.ensureCurrentUser(clerkUser);
          const healthRecord = user.healthRecord;
          const hasHealthRecord = Boolean(
            healthRecord &&
              (healthRecord.labs !== null ||
                healthRecord.medications.length > 0 ||
                (healthRecord.concerns?.trim().length ?? 0) > 0),
          );

          return {
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: user.dateOfBirth,
            locale: user.locale,
            isBioComplete: user.isBioComplete,
            healthMetrics: user.healthMetrics,
            healthRecord: user.healthRecord,
            hasHealthRecord,
            note:
              !hasHealthRecord && !user.healthMetrics
                ? EMPTY_DATA_NOTE
                : undefined,
          };
        },
      }),
    };
  }
}
