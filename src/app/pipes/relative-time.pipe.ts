import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['week', 7 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
];

@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  private readonly formatter = new Intl.RelativeTimeFormat(inject(LOCALE_ID), {
    numeric: 'auto',
  });

  transform(value: Date | string): string {
    const seconds = (new Date(value).getTime() - Date.now()) / 1000;
    for (const [unit, unitSeconds] of UNITS) {
      if (Math.abs(seconds) >= unitSeconds) {
        return this.formatter.format(Math.trunc(seconds / unitSeconds), unit);
      }
    }
    return 'just now';
  }
}
