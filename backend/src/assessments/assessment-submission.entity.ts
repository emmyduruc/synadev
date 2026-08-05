/* eslint-disable no-restricted-syntax -- TypeORM entities must be classes */
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../users/user.entity';

import type { AssessmentAnswerEntity } from './assessment-answer.entity';

@Entity({ name: 'assessment_submissions' })
export class AssessmentSubmissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 32 })
  instrument!: string;

  @Column({ name: 'assessment_id', type: 'varchar', length: 64 })
  assessmentId!: string;

  @Column({ type: 'varchar', length: 8 })
  timepoint!: string;

  @Column({ name: 'total_score', type: 'smallint', nullable: true })
  totalScore!: number | null;

  @Column({ name: 'scaled_score', type: 'real', nullable: true })
  scaledScore!: number | null;

  @Column({ type: 'smallint', nullable: true })
  somatic!: number | null;

  @Column({ type: 'smallint', nullable: true })
  psychological!: number | null;

  @Column({ type: 'smallint', nullable: true })
  urogenital!: number | null;

  @CreateDateColumn({ name: 'completed_at', type: 'timestamptz' })
  completedAt!: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  /** String relation target avoids a circular value-import with the child entity. */
  @OneToMany('AssessmentAnswerEntity', 'submission', {
    cascade: true,
    eager: true,
  })
  answers!: AssessmentAnswerEntity[];
}
