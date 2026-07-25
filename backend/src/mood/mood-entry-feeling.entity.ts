/* eslint-disable no-restricted-syntax -- TypeORM entities must be classes */
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { MoodEntryEntity } from './mood-entry.entity';

@Entity({ name: 'mood_entry_feelings' })
export class MoodEntryFeelingEntity {
  @PrimaryColumn({ name: 'mood_entry_id', type: 'uuid' })
  moodEntryId!: string;

  @PrimaryColumn({ name: 'feeling_id', type: 'varchar', length: 32 })
  feelingId!: string;

  @ManyToOne(() => MoodEntryEntity, (entry) => entry.feelings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mood_entry_id' })
  moodEntry!: MoodEntryEntity;
}
