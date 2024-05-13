import errorMessage from './messages/error-message';
import successMessage from './messages/success-message';

export { successMessage, errorMessage };

export const SYSTEM = 'System';
export const SOFT_DELETION_FIELD = 'deleted';

export const ACCESS_TOKEN_EXPIRY_TIME_IN_MIN = 120;

export const DATE_FORMAT = 'MM/dd/yyyy';
export const DATE_TIME_FORMAT = 'MM/dd/yyyy hh:mm:ss a';
// eslint-disable-next-line quotes
export const DATE_TIME_LONG_FORMAT = `EEEE dd LLLL, yyyy HH:mm:ss a`; //2024-01-10T03:09:36.184Z => Monday 08 January, 2024 03:09:36 UTC

export * from './password-regex';

export const NO_OF_DIGIT_IN_OTP = 6;
export const EARTH_MEAN_RADIUS_IN_METER = 6378137; // Earth’s mean radius in meters
