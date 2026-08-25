/* eslint-disable no-restricted-syntax -- TypeORM entities must be classes */
import type { UserHealthMetrics, UserHealthRecord } from '@syna/shared-types';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 1NF identity + bio profile table.
 * Auth credentials stay in Clerk — we only store clerk_id + profile attributes.
 * Health metrics are a typed JSONB snapshot (not raw sample history).
 * Health record is a typed JSONB clinical document (labs, meds, concerns).
 */
@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ name: 'clerk_id', type: 'varchar', length: 128 })
  clerkId!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 320 })
  email!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100, nullable: true })
  firstName!: string | null;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
  lastName!: string | null;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth!: string | null;

  @Column({ type: 'text', nullable: true })
  address!: string | null;

  /** Preferred locale for emails / push (`de` default). */
  @Column({ type: 'varchar', length: 8, default: 'de' })
  locale!: string;

  @Column({ name: 'health_metrics', type: 'jsonb', nullable: true })
  healthMetrics!: UserHealthMetrics | null;

  @Column({ name: 'health_record', type: 'jsonb', nullable: true })
  healthRecord!: UserHealthRecord | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
