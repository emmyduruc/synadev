/* eslint-disable no-restricted-syntax -- TypeORM entities must be classes */
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../users/user.entity';

@Entity({ name: 'user_report_custom_doctor_questions' })
@Index('IDX_user_report_custom_doctor_questions_user', ['userId'])
export class UserReportCustomDoctorQuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'question_text', type: 'varchar', length: 500 })
  questionText!: string;

  @Column({ name: 'sort_order', type: 'smallint', default: 0 })
  sortOrder!: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
