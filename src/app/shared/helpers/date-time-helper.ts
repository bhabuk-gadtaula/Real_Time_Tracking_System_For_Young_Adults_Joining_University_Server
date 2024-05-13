import { DateTime } from 'luxon';
import { DateUnit } from '../enums';

class DateTimeHelper {
  get getCurrentUTCDate(): Date {
    const dateTime = DateTime.fromISO(new Date().toISOString());

    return dateTime.toUTC().toJSDate();
  }

  /**
   * The function `getUTCFormatDate` takes a format string and an optional date string, and returns the
   * formatted date in UTC format.
   * @param {string} format - A string representing the desired format for the UTC date. This format
   * should follow the syntax specified by Luxon library's DateTime.toFormat() method. Some common format
   * options include "yyyy-MM-dd" for the date in the format "2022-01-01", "HH:mm:ss" for the
   * @param {string} [date] - An optional parameter that represents the date in ISO 8601 format. If not
   * provided, the current date and time will be used.
   * @returns a formatted date string in UTC format.
   */
  getUTCFormatDate(format: string, date?: string) {
    const dateTime = DateTime.fromISO(date ?? new Date().toISOString());

    return dateTime.toFormat(format);
  }

  /**
   * The function takes a date, an amount, and units as parameters, and returns a modified date by adding
   * the specified amount of units to it.
   * @param {Date} date - The `date` parameter is a JavaScript `Date` object representing a specific date
   * and time.
   * @param {number} amount - The `amount` parameter represents the number of units to add or subtract
   * from the given date. It can be a positive or negative number depending on whether you want to add or
   * subtract units from the date.
   * @param {DateUnit} units - The `units` parameter in the `addDate` function represents the units of
   * time that you want to add to the given date. It can have one of the following values:
   * @returns a modified date as a JavaScript Date object.
   */
  addDate(date: Date, amount: number, units: DateUnit) {
    const dateTime = DateTime.fromJSDate(date);
    const modifiedDateTime = dateTime.plus({ [units]: amount });

    return modifiedDateTime.toJSDate();
  }

  /**
   * The function checks if a given date is expired by comparing it to the current date and time.
   * @param {Date} dateObj - A JavaScript Date object representing a specific date and time.
   * @returns a boolean value indicating whether the given date is expired or not.
   */
  checkIfDateIsExpired(dateObj: Date) {
    return DateTime.fromJSDate(dateObj) < DateTime.now();
  }

  resetTimeToMidnight(inputDate: string | Date): string {
    // Parse the input date using Luxon
    const luxonDateTime = DateTime.fromJSDate(inputDate instanceof Date ? inputDate : new Date(inputDate), { zone: 'utc' });

    // Set the time to midnight
    const resultDateTime = luxonDateTime.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    // Format the result as a string in the desired format
    const resultDateString = resultDateTime.toISO({ includeOffset: true });

    return resultDateString || ''; // Add a fallback for potential errors
  }
}

export default new DateTimeHelper();
