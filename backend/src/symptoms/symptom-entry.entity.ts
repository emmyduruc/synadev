/* eslint-disable no-restricted-syntax -- TypeORM entities must be classes */
import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { UserEntity } from '../users/user.entity';

import { SymptomEntity } from './symptom.entity';

@Entity({ name: 'symptom_entries' })
@Index('IDX_symptom_entries_user_log_date', ['userId', 'logDate'])
export class SymptomEntryEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @PrimaryColumn({ name: 'log_date', type: 'date' })
  logDate!: string;

  @PrimaryColumn({ name: 'symptom_id', type: 'varchar', length: 64 })
  symptomId!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToOne(() => SymptomEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'symptom_id' })
  symptom!: SymptomEntity;
}
