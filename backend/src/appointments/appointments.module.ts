import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { UserAppointmentEntity } from './user-appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAppointmentEntity]),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
