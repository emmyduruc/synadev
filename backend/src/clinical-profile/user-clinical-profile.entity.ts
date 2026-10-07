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

@Entity({ name: 'user_clinical_profiles' })
export class UserClinicalProfileEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'uterus_removed', type: 'boolean', nullable: true })
  uterusRemoved!: boolean | null;

  @Column({ name: 'ovaries_removed', type: 'boolean', nullable: true })
  ovariesRemoved!: boolean | null;

  @Column({ name: 'endometrial_ablation', type: 'boolean', nullable: true })
  endometrialAblation!: boolean | null;

  @Column({ name: 'hormone_iud', type: 'boolean', nullable: true })
  hormoneIud!: boolean | null;

  @Column({ name: 'hormonal_contraception', type: 'boolean', nullable: true })
  hormonalContraception!: boolean | null;

  @Column({ name: 'hormone_therapy', type: 'boolean', nullable: true })
  hormoneTherapy!: boolean | null;

  @Column({ name: 'thyroid_disease', type: 'boolean', nullable: true })
  thyroidDisease!: boolean | null;

  @Column({ name: 'age_at_first_period', type: 'smallint', nullable: true })
  ageAtFirstPeriod!: number | null;

  @Column({
    name: 'persistent_complaint_ids',
    type: 'jsonb',
    default: () => "'[]'::jsonb",
  })
  persistentComplaintIds!: string[];

  @Column({
    name: 'gynecological_history_ids',
    type: 'jsonb',
    default: () => "'[]'::jsonb",
  })
  gynecologicalHistoryIds!: string[];

  @Column({
    name: 'general_condition_ids',
    type: 'jsonb',
    default: () => "'[]'::jsonb",
  })
  generalConditionIds!: string[];

  @Column({
    name: 'medication_topic_ids',
    type: 'jsonb',
    default: () => "'[]'::jsonb",
  })
  medicationTopicIds!: string[];

  @Column({
    name: 'lifestyle_topic_ids',
    type: 'jsonb',
    default: () => "'[]'::jsonb",
  })
  lifestyleTopicIds!: string[];

  @Column({
    name: 'family_history_ids',
    type: 'jsonb',
    default: () => "'[]'::jsonb",
  })
  familyHistoryIds!: string[];

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
