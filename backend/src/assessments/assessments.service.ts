import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ASSESSMENT_INSTRUMENT,
  ASSESSMENT_TIMEPOINT,
  ASSESSMENT_TIMEPOINTS,
  MRS_II_ASSESSMENT_ID,
  MRS_II_ASSESSMENT_IDS,
  MRS_II_ITEM_KEYS,
  PAM13_ITEM_KEYS,
  PHQ2_ITEM_KEYS,
  computeMrsIiSubscores,
  computeMrsIiTotal,
  computePam13RawTotal,
  computePhq2Total,
  type MrsIiAssessmentSubmission,
  type MrsIiLatest,
  type MrsIiSeverityValue,
  type Pam13AssessmentSubmission,
  type Pam13Latest,
  type Pam13ResponseValue,
  type Phq2AssessmentSubmission,
  type Phq2Latest,
  type Phq2SeverityValue,
  type SubmitMrsIiAssessment,
  type SubmitPam13Assessment,
  type SubmitPhq2Assessment,
} from '@syna/shared-types';
import { Repository } from 'typeorm';

import type { AuthenticatedClerkUser } from '../auth/auth.types';
import { UsersService } from '../users/users.service';

import { AssessmentAnswerEntity } from './assessment-answer.entity';
import { AssessmentSubmissionEntity } from './assessment-submission.entity';

const toIsoDateTime = (value: Date): string => value.toISOString();

const sortAnswersByIndex = (
  answers: AssessmentAnswerEntity[],
): AssessmentAnswerEntity[] =>
  [...answers].sort((left, right) => left.itemIndex - right.itemIndex);

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(AssessmentSubmissionEntity)
    private readonly submissionsRepository: Repository<AssessmentSubmissionEntity>,
    private readonly usersService: UsersService,
  ) {}

  async submitMrsIi(
    clerkUser: AuthenticatedClerkUser,
    input: SubmitMrsIiAssessment,
  ): Promise<MrsIiAssessmentSubmission> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const answers = input.answers as MrsIiSeverityValue[];
    const subscores = computeMrsIiSubscores(answers);
    const total = computeMrsIiTotal(answers);

    const submission = this.submissionsRepository.create({
      userId,
      instrument: ASSESSMENT_INSTRUMENT.mrsIi,
      assessmentId: input.assessmentId,
      timepoint: input.timepoint,
      totalScore: total,
      scaledScore: null,
      somatic: subscores.somatic,
      psychological: subscores.psychological,
      urogenital: subscores.urogenital,
      answers: MRS_II_ITEM_KEYS.map((itemKey, itemIndex) => ({
        itemKey,
        itemIndex,
        value: answers[itemIndex],
      })),
    });

    const saved = await this.submissionsRepository.save(submission);

    return this.toMrsIiSubmission(saved);
  }

  async getLatestMrsIi(clerkUser: AuthenticatedClerkUser): Promise<MrsIiLatest> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const submission = await this.findLatest(userId, ASSESSMENT_INSTRUMENT.mrsIi);

    return {
      submission: submission ? this.toMrsIiSubmission(submission) : null,
    };
  }

  async submitPam13(
    clerkUser: AuthenticatedClerkUser,
    input: SubmitPam13Assessment,
  ): Promise<Pam13AssessmentSubmission> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const answers = input.answers as Pam13ResponseValue[];
    const rawTotal = computePam13RawTotal(answers);

    const submission = this.submissionsRepository.create({
      userId,
      instrument: ASSESSMENT_INSTRUMENT.pam13,
      assessmentId: input.assessmentId,
      timepoint: input.timepoint,
      totalScore: rawTotal,
      scaledScore: null,
      somatic: null,
      psychological: null,
      urogenital: null,
      answers: PAM13_ITEM_KEYS.map((itemKey, itemIndex) => ({
        itemKey,
        itemIndex,
        value: answers[itemIndex],
      })),
    });

    const saved = await this.submissionsRepository.save(submission);

    return this.toPam13Submission(saved);
  }

  async getLatestPam13(clerkUser: AuthenticatedClerkUser): Promise<Pam13Latest> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const submission = await this.findLatest(userId, ASSESSMENT_INSTRUMENT.pam13);

    return {
      submission: submission ? this.toPam13Submission(submission) : null,
    };
  }

  async submitPhq2(
    clerkUser: AuthenticatedClerkUser,
    input: SubmitPhq2Assessment,
  ): Promise<Phq2AssessmentSubmission> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const answers = input.answers as Phq2SeverityValue[];
    const total = computePhq2Total(answers);

    const submission = this.submissionsRepository.create({
      userId,
      instrument: ASSESSMENT_INSTRUMENT.phq2,
      assessmentId: input.assessmentId,
      timepoint: input.timepoint,
      totalScore: total,
      scaledScore: null,
      somatic: null,
      psychological: null,
      urogenital: null,
      answers: PHQ2_ITEM_KEYS.map((itemKey, itemIndex) => ({
        itemKey,
        itemIndex,
        value: answers[itemIndex],
      })),
    });

    const saved = await this.submissionsRepository.save(submission);

    return this.toPhq2Submission(saved);
  }

  async getLatestPhq2(clerkUser: AuthenticatedClerkUser): Promise<Phq2Latest> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const submission = await this.findLatest(userId, ASSESSMENT_INSTRUMENT.phq2);

    return {
      submission: submission ? this.toPhq2Submission(submission) : null,
    };
  }

  private async findLatest(
    userId: string,
    instrument: string,
  ): Promise<AssessmentSubmissionEntity | null> {
    return this.submissionsRepository.findOne({
      where: { userId, instrument },
      order: { completedAt: 'DESC' },
      relations: { answers: true },
    });
  }

  private toMrsIiSubmission(
    entity: AssessmentSubmissionEntity,
  ): MrsIiAssessmentSubmission {
    const answersByKey = new Map(
      (entity.answers ?? []).map((answer) => [answer.itemKey, answer.value]),
    );
    const answers = MRS_II_ITEM_KEYS.map((itemKey) => {
      const value = answersByKey.get(itemKey);

      if (typeof value !== 'number' || !Number.isFinite(value)) {
        return 0;
      }

      return Math.min(4, Math.max(0, Math.round(value))) as MrsIiSeverityValue;
    });

    const assessmentId = (MRS_II_ASSESSMENT_IDS as readonly string[]).includes(
      entity.assessmentId,
    )
      ? (entity.assessmentId as MrsIiAssessmentSubmission['assessmentId'])
      : MRS_II_ASSESSMENT_ID.baseline;

    const timepoint = (ASSESSMENT_TIMEPOINTS as readonly string[]).includes(entity.timepoint)
      ? (entity.timepoint as MrsIiAssessmentSubmission['timepoint'])
      : ASSESSMENT_TIMEPOINT.t0;

    const computedSubscores = computeMrsIiSubscores(answers);

    return {
      id: entity.id,
      assessmentId,
      timepoint,
      answers,
      total: entity.totalScore ?? computeMrsIiTotal(answers),
      subscores: {
        somatic: entity.somatic ?? computedSubscores.somatic,
        psychological: entity.psychological ?? computedSubscores.psychological,
        urogenital: entity.urogenital ?? computedSubscores.urogenital,
      },
      completedAt: toIsoDateTime(entity.completedAt),
    };
  }

  private toPam13Submission(
    entity: AssessmentSubmissionEntity,
  ): Pam13AssessmentSubmission {
    const ordered = sortAnswersByIndex(entity.answers ?? []);

    return {
      id: entity.id,
      assessmentId: entity.assessmentId as Pam13AssessmentSubmission['assessmentId'],
      timepoint: entity.timepoint as Pam13AssessmentSubmission['timepoint'],
      answers: ordered.map((answer) => answer.value as Pam13ResponseValue),
      rawTotal: entity.totalScore ?? 0,
      scaledScore: entity.scaledScore,
      completedAt: toIsoDateTime(entity.completedAt),
    };
  }

  private toPhq2Submission(
    entity: AssessmentSubmissionEntity,
  ): Phq2AssessmentSubmission {
    const ordered = sortAnswersByIndex(entity.answers ?? []);

    return {
      id: entity.id,
      assessmentId: entity.assessmentId as Phq2AssessmentSubmission['assessmentId'],
      timepoint: entity.timepoint as Phq2AssessmentSubmission['timepoint'],
      answers: ordered.map((answer) => answer.value as Phq2SeverityValue),
      total: entity.totalScore ?? 0,
      completedAt: toIsoDateTime(entity.completedAt),
    };
  }
}
