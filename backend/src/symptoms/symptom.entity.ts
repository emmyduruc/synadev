/* eslint-disable no-restricted-syntax -- TypeORM entities must be classes */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { UserEntity } from '../users/user.entity';

import { SymptomCategoryEntity } from './symptom-category.entity';

@Entity({ name: 'symptoms' })
export class SymptomEntity {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id!: string;

  @Column({ name: 'category_id', type: 'varchar', length: 32 })
  categoryId!: string;

  @Column({ name: 'sort_order', type: 'smallint', default: 0 })
  sortOrder!: number;

  /** Null for seeded catalog rows; set for user-defined custom symptoms. */
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId!: string | null;

  /** Display label for custom symptoms (catalog labels live in client i18n). */
  @Column({ type: 'varchar', length: 80, nullable: true })
  label!: string | null;

  @ManyToOne(() => SymptomCategoryEntity, (category) => category.symptoms, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category!: SymptomCategoryEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity | null;
}
