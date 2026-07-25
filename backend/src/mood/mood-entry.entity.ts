/* eslint-disable no-restricted-syntax -- TypeORM entities must be classes */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '../users/user.entity';

import { MoodEntryFeelingEntity } from './mood-entry-feeling.entity';

@Entity({ name: 'mood_entries' })
@Unique('UQ_mood_entries_user_date', ['userId', 'logDate'])
export class MoodEntryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'log_date', type: 'date' })
  logDate!: string;

  @Column({ name: 'primary_mood_id', type: 'varchar', length: 32, nullable: true })
  primaryMoodId!: string | null;

  @Column({ type: 'smallint', default: 0 })
  energy!: number;

  @Column({ type: 'smallint', default: 0 })
  stress!: number;

  @Column({ type: 'text', default: '' })
  note!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @OneToMany(() => MoodEntryFeelingEntity, (feeling) => feeling.moodEntry, {
    cascade: true,
    eager: true,
  })
  feelings!: MoodEntryFeelingEntity[];
}
