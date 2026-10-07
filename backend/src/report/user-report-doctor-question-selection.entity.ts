/* eslint-disable no-restricted-syntax -- TypeORM entities must be classes */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { UserEntity } from '../users/user.entity';

@Entity({ name: 'user_report_doctor_question_selections' })
export class UserReportDoctorQuestionSelectionEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @PrimaryColumn({ name: 'question_id', type: 'varchar', length: 64 })
  questionId!: string;

  @Column({ name: 'sort_order', type: 'smallint', default: 0 })
  sortOrder!: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
