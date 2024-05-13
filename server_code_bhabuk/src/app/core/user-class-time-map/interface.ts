import { IPagination } from '../../shared';

export interface IClassMapId {
  id: number;
}
export interface ICreateClassUserMap {
  classId: number;
  userId: number;
}

export interface IClassTriggerFindQueryParams extends IPagination {
  classId?: number;
}

export interface IUserClassMapFindQueryParams extends IPagination {
  classId?: number;
}
