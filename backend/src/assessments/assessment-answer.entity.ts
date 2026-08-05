/* eslint-disable no-restricted-syntax -- TypeORM entities must be classes */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import type { AssessmentSubmissionEntity } from './assessment-submission.entity';

@Entity({ name: 'assessment_answers' })
export class AssessmentAnswerEntity {
  @PrimaryColumn({ name: 'submission_id', type: 'uuid' })
  submissionId!: string;

  @PrimaryColumn({ name: 'item_key', type: 'varchar', length: 64 })
  itemKey!: string;

  @Column({ name: 'item_index', type: 'smallint' })
  itemIndex!: number;

  @Column({ type: 'smallint' })
  value!: number;

  @ManyToOne('AssessmentSubmissionEntity', 'answers', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'submission_id' })
  submission!: AssessmentSubmissionEntity;
}
