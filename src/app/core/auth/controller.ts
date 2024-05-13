import AuthService from './service';
import { NextFunction, Request, Response, success } from '../../shared';

export default class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.login(req.body);
      res.send(success(data, 'Login successfully'));
    } catch (error: any) {
      next(error);
    }
  };
}
