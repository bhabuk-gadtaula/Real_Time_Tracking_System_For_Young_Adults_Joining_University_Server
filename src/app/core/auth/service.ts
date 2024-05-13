import bcrypt from 'bcrypt';
import { ILoginValidation } from './validation';
import UserService from '../user-management/service';
import { UserRole, UserStatus } from '../user-management';
import { CustomError, getFullName, jwtHelper } from '../../shared';

export default class AuthService {
  constructor(private userService: UserService) {}

  async login(body: ILoginValidation) {
    const user = await this.userService.findOneBy({ email: body.email, status: UserStatus.ACTIVE });

    if (!user) throw new CustomError('Login credentials invalid', 400);

    const comparePassword = await bcrypt.compare(body.password, user.password);

    if (!comparePassword) throw new CustomError('Login credentials invalid', 400);

    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      ...(user?.middleName && { middleName: user.middleName }),
      role: user.role,
      parentId: user.role === UserRole.CHILD ? user.ancestorId : user.id,
      fullName: getFullName({ firstName: user.firstName, lastName: user.lastName, middleName: user?.middleName }),
    };

    return {
      accessToken: jwtHelper.generate(payload),
      user: payload,
    };
  }
}
