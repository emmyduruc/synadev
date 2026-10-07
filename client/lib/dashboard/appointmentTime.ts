export type AppointmentTimeParts = {
  hour: number;
  minute: number;
};

const DEFAULT_HOUR = 8;
const DEFAULT_MINUTE = 50;

export const formatAppointmentTime = (hour: number, minute: number): string =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

export const parseAppointmentTime = (
  value: string | null | undefined,
): AppointmentTimeParts => {
  if (!value) {
    return { hour: DEFAULT_HOUR, minute: DEFAULT_MINUTE };
  }

  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());

  if (!match) {
    return { hour: DEFAULT_HOUR, minute: DEFAULT_MINUTE };
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return { hour: DEFAULT_HOUR, minute: DEFAULT_MINUTE };
  }

  return { hour, minute };
};
