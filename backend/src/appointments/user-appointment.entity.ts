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

@Entity({ name: 'user_appointments' })
export class UserAppointmentEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'appointment_date', type: 'date', nullable: true })
  appointmentDate!: string | null;

  @Column({ name: 'appointment_time', type: 'varchar', length: 5, nullable: true })
  appointmentTime!: string | null;

  @Column({ name: 'doctor_name', type: 'varchar', length: 200, nullable: true })
  doctorName!: string | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
