/* eslint-disable no-restricted-syntax -- TypeORM entities must be classes */
import type {
  PeriodBleedingType,
  PeriodObservation,
  PeriodStrength,
} from '@syna/shared-types';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { UserEntity } from '../users/user.entity';

@Entity({ name: 'period_days' })
export class PeriodDayEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @PrimaryColumn({ name: 'log_date', type: 'date' })
  logDate!: string;

  @Column({ name: 'is_first_day', type: 'boolean', nullable: true })
  isFirstDay!: boolean | null;

  @Column({ name: 'bleeding_type', type: 'varchar', length: 32, nullable: true })
  bleedingType!: PeriodBleedingType | null;

  @Column({ name: 'strength', type: 'varchar', length: 16, nullable: true })
  strength!: PeriodStrength | null;

  @Column({
    name: 'observations',
    type: 'jsonb',
    default: () => "'[]'::jsonb",
  })
  observations!: PeriodObservation[];

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
