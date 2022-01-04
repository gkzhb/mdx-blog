import dayjs from 'dayjs';

export function getDate(date: Date | string) {
  const day = dayjs(date);
  return day.format('YYYY-M-D');
}
