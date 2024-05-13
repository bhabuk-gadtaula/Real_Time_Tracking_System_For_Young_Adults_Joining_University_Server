import { Gender } from '../enums';
import { AnyObj } from '../types';

export interface IDateRange {
  startDateTime: Date;
  endDateTime: Date;
}

export interface IName {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface IAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface IContact {
  name?: string;
  phone?: string;
  email?: string;
  fax?: string;
}

export interface IDemographic extends IName {
  gender?: Gender;
  dob?: Date | string;
  phone?: string;
  address?: IAddress;
}

export interface IReconcileException<T> {
  code: T;
  note?: string;
  data?: { label?: string; claimData?: any; claimPaymentData?: any }[] | AnyObj;
}

export interface IDocumentErrorPayload {
  processedTimestamp: string | Date;
  destination: {
    fileName: string;
    filePath: string;
    absolutePath?: string;
  };
  source?: { absolutePath?: string };
  reason: string;
}
