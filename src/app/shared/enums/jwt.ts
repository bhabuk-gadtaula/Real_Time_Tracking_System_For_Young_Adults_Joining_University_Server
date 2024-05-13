export enum JWTVerifyErrorType {
  EXPIRED = 'TokenExpiredError',
  INVALID = 'JsonWebTokenError',
  INACTIVE = 'NotBeforeError',
}
