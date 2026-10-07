import { z } from 'zod';

import { IsoDateSchema } from './iso-date.schema';

/** HH:mm 24h clock time. */
export const AppointmentTimeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Expected HH:mm')
  .describe('Appointment clock time (HH:mm)');

export const UserAppointmentSchema = z
  .object({
    appointmentDate: IsoDateSchema.nullable().describe(
      'Appointment calendar date (YYYY-MM-DD); null if unset',
    ),
    appointmentTime: AppointmentTimeSchema.nullable().describe(
      'Appointment clock time (HH:mm); null if unset',
    ),
    doctorName: z
      .string()
      .trim()
      .max(200)
      .nullable()
      .describe('Optional doctor or practice name'),
  })
  .describe('Upcoming doctor appointment for the authenticated user');

export type UserAppointment = z.infer<typeof UserAppointmentSchema>;

export const UpdateUserAppointmentSchema = UserAppointmentSchema.describe(
  'Replace the user appointment (full replace)',
);

export type UpdateUserAppointment = z.infer<typeof UpdateUserAppointmentSchema>;

export const createEmptyUserAppointment = (): UserAppointment => ({
  appointmentDate: null,
  appointmentTime: null,
  doctorName: null,
});
