import type { UserAppointment } from '@syna/shared-types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Parse UI date `DD.MM.YYYY` into ISO `YYYY-MM-DD`. */
export const parseDisplayDateToIso = (value: string): string | null => {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim());

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

/** Format ISO `YYYY-MM-DD` as `DD.MM.YYYY` for the edit sheet. */
export const formatIsoDateToDisplay = (isoDate: string | null): string => {
  if (!isoDate) {
    return '';
  }

  const [year, month, day] = isoDate.split('-');

  if (!year || !month || !day) {
    return '';
  }

  return `${day}.${month}.${year}`;
};

export const formatAppointmentDateTimeLabel = (
  appointment: UserAppointment,
  locale: string,
): string | null => {
  if (!appointment.appointmentDate) {
    return null;
  }

  const [year, month, day] = appointment.appointmentDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const datePart = date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  if (!appointment.appointmentTime) {
    return datePart;
  }

  return `${datePart}, ${appointment.appointmentTime}`;
};

export const getAppointmentDaysUntil = (
  appointment: UserAppointment,
): number | null => {
  if (!appointment.appointmentDate) {
    return null;
  }

  const [year, month, day] = appointment.appointmentDate.split('-').map(Number);
  const target = Date.UTC(year, month - 1, day);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / MS_PER_DAY);
};

export const hasScheduledAppointment = (appointment: UserAppointment): boolean =>
  Boolean(appointment.appointmentDate || appointment.appointmentTime || appointment.doctorName);
