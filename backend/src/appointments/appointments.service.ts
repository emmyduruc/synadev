import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  createEmptyUserAppointment,
  type UpdateUserAppointment,
  type UserAppointment,
} from '@syna/shared-types';
import { Repository } from 'typeorm';

import type { AuthenticatedClerkUser } from '../auth/auth.types';
import { UsersService } from '../users/users.service';

import { UserAppointmentEntity } from './user-appointment.entity';

const toDateKey = (value: string | Date | null | undefined): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
};

const toAppointment = (
  entity: UserAppointmentEntity | null,
): UserAppointment => {
  if (!entity) {
    return createEmptyUserAppointment();
  }

  return {
    appointmentDate: toDateKey(entity.appointmentDate),
    appointmentTime: entity.appointmentTime,
    doctorName: entity.doctorName?.trim() || null,
  };
};

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(UserAppointmentEntity)
    private readonly appointmentRepository: Repository<UserAppointmentEntity>,
    private readonly usersService: UsersService,
  ) {}

  async getAppointment(
    clerkUser: AuthenticatedClerkUser,
  ): Promise<UserAppointment> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const entity = await this.appointmentRepository.findOne({
      where: { userId },
    });
    return toAppointment(entity);
  }

  async replaceAppointment(
    clerkUser: AuthenticatedClerkUser,
    input: UpdateUserAppointment,
  ): Promise<UserAppointment> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const trimmedName = input.doctorName?.trim() || null;

    await this.appointmentRepository.save(
      this.appointmentRepository.create({
        userId,
        appointmentDate: input.appointmentDate,
        appointmentTime: input.appointmentTime,
        doctorName: trimmedName,
      }),
    );

    return this.getAppointment(clerkUser);
  }

  async clearAppointment(
    clerkUser: AuthenticatedClerkUser,
  ): Promise<UserAppointment> {
    return this.replaceAppointment(clerkUser, createEmptyUserAppointment());
  }
}
