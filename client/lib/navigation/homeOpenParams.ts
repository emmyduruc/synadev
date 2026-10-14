/** Query params that open home sheets after navigating to the start tab. */
export const HOME_OPEN = {
  doctorQuestions: 'doctorQuestions',
  appointment: 'appointment',
} as const;

export type HomeOpenParam = (typeof HOME_OPEN)[keyof typeof HOME_OPEN];

export const isHomeOpenParam = (value: string | undefined): value is HomeOpenParam =>
  value === HOME_OPEN.doctorQuestions || value === HOME_OPEN.appointment;
