import jwt from 'jsonwebtoken';
import { AnyObj } from '../../types';
import { JWTVerifyErrorType } from '../../enums';

export interface IToken {
  generate(payload: string | AnyObj, expiresIn?: number): string;
  verify(token: string): { isValid: boolean; error?: JWTVerifyErrorType; decodedToken: jwt.JwtPayload };
  decode(token: string): AnyObj | string | null;
}
