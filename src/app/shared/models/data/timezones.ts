import * as moment from 'moment';

export interface Timezone {
  offset: string;
  timezone: string;
  label: string;
}

/**
 * Timezone data based on moment timezone data.
 */
export const IANA_TIMEZONES: Timezone[] = moment.tz.names().map((tz) => {
  const offset = moment.tz(tz).format('Z');
  return { offset, timezone: tz, label: `${tz} (${offset})` };
});
