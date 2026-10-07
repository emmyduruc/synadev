/* eslint-disable no-restricted-syntax -- TypeORM entities must be classes */
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '../users/user.entity';

@Entity({ name: 'user_report_preferences' })
export class UserReportPreferencesEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'period_preset', type: 'varchar', length: 32, nullable: true })
  periodPreset!: string | null;

  @Column({ name: 'period_from_date', type: 'date', nullable: true })
  periodFromDate!: string | null;

  @Column({ name: 'period_to_date', type: 'date', nullable: true })
  periodToDate!: string | null;

  @Column({ name: 'concern_free_text', type: 'text', nullable: true })
  concernFreeText!: string | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
