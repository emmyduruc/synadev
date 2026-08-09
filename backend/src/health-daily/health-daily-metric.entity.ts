/* eslint-disable no-restricted-syntax -- TypeORM entities must be classes */
import type { HealthPlatform, UserHealthMetricsMap } from '@syna/shared-types';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '../users/user.entity';

@Entity({ name: 'health_daily_metrics' })
export class HealthDailyMetricEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @PrimaryColumn({ name: 'log_date', type: 'date' })
  logDate!: string;

  @Column({ name: 'platform', type: 'varchar', length: 64 })
  platform!: HealthPlatform;

  @Column({ name: 'metrics', type: 'jsonb', default: {} })
  metrics!: UserHealthMetricsMap;

  @Column({ name: 'synced_at', type: 'timestamptz' })
  syncedAt!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
