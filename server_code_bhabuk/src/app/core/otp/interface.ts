export enum Scope {
  FORGOT_PASSWORD = 'FORGOT-PASSWORD',
}

export interface ICreateOtp {
  userId: number;
  scope: Scope;
}

export interface IRevokedOtp {
  otpId: number;
  userId: number;
}

export interface IValidateOtp extends ICreateOtp {
  otp: string;
}
