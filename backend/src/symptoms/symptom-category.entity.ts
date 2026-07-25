/* eslint-disable no-restricted-syntax -- TypeORM entities must be classes */
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { SymptomEntity } from './symptom.entity';

@Entity({ name: 'symptom_categories' })
export class SymptomCategoryEntity {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  id!: string;

  @Column({ name: 'sort_order', type: 'smallint', default: 0 })
  sortOrder!: number;

  @OneToMany(() => SymptomEntity, (symptom) => symptom.category)
  symptoms!: SymptomEntity[];
}
