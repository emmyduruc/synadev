/* eslint-disable no-restricted-syntax -- TypeORM entities must be classes */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { SymptomCategoryEntity } from './symptom-category.entity';

@Entity({ name: 'symptoms' })
export class SymptomEntity {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id!: string;

  @Column({ name: 'category_id', type: 'varchar', length: 32 })
  categoryId!: string;

  @Column({ name: 'sort_order', type: 'smallint', default: 0 })
  sortOrder!: number;

  @ManyToOne(() => SymptomCategoryEntity, (category) => category.symptoms, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category!: SymptomCategoryEntity;
}
