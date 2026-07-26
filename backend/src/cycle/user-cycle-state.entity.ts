/* eslint-disable no-restricted-syntax -- TypeORM entities must be classes */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '../users/user.entity';

@Entity({ name: 'user_cycle_state' })
export class UserCycleStateEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'current_phase', type: 'varchar', length: 32, nullable: true })
  currentPhase!: string | null;

  @Column({ name: 'cycle_day', type: 'smallint', nullable: true })
  cycleDay!: number | null;

  @Column({ name: 'period_start_date', type: 'date', nullable: true })
  periodStartDate!: string | null;

  @Column({ name: 'next_period_date', type: 'date', nullable: true })
  nextPeriodDate!: string | null;

  @Column({ name: 'cycle_length_days', type: 'smallint', default: 28 })
  cycleLengthDays!: number;

  @Column({ name: 'period_length_days', type: 'smallint', default: 5 })
  periodLengthDays!: number;

  @Column({ name: 'notified_phase', type: 'varchar', length: 32, nullable: true })
  notifiedPhase!: string | null;

  @Column({ name: 'notified_at', type: 'timestamptz', nullable: true })
  notifiedAt!: Date | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
