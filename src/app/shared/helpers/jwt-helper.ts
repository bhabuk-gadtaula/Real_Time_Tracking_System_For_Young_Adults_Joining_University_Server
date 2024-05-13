import jwt from 'jsonwebtoken';
import { IToken } from './interfaces';
import { JWTVerifyErrorType } from '../enums';
import { configService } from '../../../config';
import { ACCESS_TOKEN_EXPIRY_TIME_IN_MIN } from '../constants';

class JwtToken implements IToken {
  generate(payload: any, expiresIn = ACCESS_TOKEN_EXPIRY_TIME_IN_MIN) {
    return jwt.sign(payload, configService.getJwtConfig.secret, { expiresIn: expiresIn * 60 });
  }

  verify(token: string) {
    const decodedToken = jwt.decode(token) as jwt.JwtPayload;
    try {
      jwt.verify(token, configService.getJwtConfig.secret);

      return {
        isValid: true,
        decodedToken,
      };
    } catch (error: any) {
      return {
        isValid: false,
        decodedToken,
        error: error.name as JWTVerifyErrorType,
      };
    }
  }

  decode(token: string) {
    return jwt.verify(token, configService.getJwtConfig.secret);
  }
}

export default new JwtToken();
