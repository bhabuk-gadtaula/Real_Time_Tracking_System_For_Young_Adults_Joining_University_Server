import { UserRole } from '../../core/user-management';

export interface IAuthUser {
  email: string;
  firstName: string;
  fullName: string;
  lastName: string;
  middleName: string;
  id: number;
  iat: number;
  exp: number;
  role: UserRole;
  parentId: number;
}

export interface ILoginAuthUserResponse {
  email: string;
  firstName: string;
  fullName: string;
  lastName: string;
  middleName: string;
  userId: string;
}

export interface IServiceOptions {
  authUser?: IAuthUser;
}
