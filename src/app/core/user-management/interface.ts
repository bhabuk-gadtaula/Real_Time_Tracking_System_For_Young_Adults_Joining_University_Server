import { IPagination } from '../../shared';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  CHILD = 'CHILD',
}

export interface IFindQueryParams extends IPagination {
  role?: UserRole;
  ancestorId?: string;
}
