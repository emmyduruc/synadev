import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ASSESSMENT_INSTRUMENT,
  MRS_II_ITEM_KEYS,
  PAM13_ITEM_KEYS,
  computeMrsIiSubscores,
  computeMrsIiTotal,
  computePam13RawTotal,
  type MrsIiAssessmentSubmission,
  type MrsIiLatest,
  type MrsIiSeverityValue,
  type Pam13AssessmentSubmission,
  type Pam13Latest,
  type Pam13ResponseValue,
  type SubmitMrsIiAssessment,
  type SubmitPam13Assessment,
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

  private async findLatest(
    userId: string,
    instrument: string,
  ): Promise<AssessmentSubmissionEntity | null> {
    return this.submissionsRepository.findOne({
      where: { userId, instrument },
      order: { completedAt: 'DESC' },
    });
  }

  private toMrsIiSubmission(
    entity: AssessmentSubmissionEntity,
  ): MrsIiAssessmentSubmission {
    const ordered = sortAnswersByIndex(entity.answers ?? []);

    return {
      id: entity.id,
      assessmentId: entity.assessmentId as MrsIiAssessmentSubmission['assessmentId'],
      timepoint: entity.timepoint as MrsIiAssessmentSubmission['timepoint'],
      answers: ordered.map((answer) => answer.value as MrsIiSeverityValue),
      total: entity.totalScore ?? 0,
      subscores: {
        somatic: entity.somatic ?? 0,
        psychological: entity.psychological ?? 0,
        urogenital: entity.urogenital ?? 0,
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
}
