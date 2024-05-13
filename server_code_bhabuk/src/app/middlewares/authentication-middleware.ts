import { jwtHelper } from '../shared/helpers';
import { IAuth, NextFunction, Request, Response } from '../shared/types';

export default function authenticate(req: Request, res: Response, next: NextFunction) {
  let accessToken = req?.headers?.authorization;
  if (!accessToken) return res.status(401).json({ message: 'Token Required' });

  accessToken = accessToken.replace('Bearer ', '');

  const { isValid, decodedToken } = jwtHelper.verify(accessToken);
  if (!isValid) return res.status(401).json({ message: 'Unauthorized Token' });
  req.authUser = decodedToken as IAuth;

  next();
}
