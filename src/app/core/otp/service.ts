import { OtpEntity } from './entity';
import { ICreateOtp, IRevokedOtp, IValidateOtp } from './interface';
import { BaseRepository, BaseService, CustomError, IServiceOptions, NO_OF_DIGIT_IN_OTP, generateOTP } from '../../shared';

export default class OtpService extends BaseService<OtpEntity> {
  constructor(protected repository: BaseRepository<OtpEntity>) {
    super(repository);
  }

  createOtp(body: ICreateOtp, options?: IServiceOptions) {
    const otp = generateOTP(NO_OF_DIGIT_IN_OTP);

    const payload = {
      otp,
      userId: body.userId,
      scope: body.scope,
      createdBy: body.userId,
      updatedBy: body.userId,
    };

    return super.create(payload);
  }

  async validateOtp(body: IValidateOtp, options?: IServiceOptions) {
    const otp = await this.repository.model.findOneBy({ otp: body.otp, revoked: false, userId: body.userId, scope: body.scope });

    if (!otp) throw new CustomError('Otp mismatch!', 400);

    return {
      otp: otp.otp,
      otpId: otp.id,
    };
  }

  async resendOtp(body: ICreateOtp, options?: IServiceOptions) {
    await this.repository.model.update(
      { userId: body.userId, scope: body.scope, revoked: false },
      { revoked: true, updatedAt: new Date(), updatedBy: body.userId }
    );

    return this.createOtp(body);
  }

  async revokeOtp(body: IRevokedOtp, options?: IServiceOptions) {
    await this.repository.model.update({ id: body.otpId }, { revoked: true, updatedAt: new Date(), updatedBy: body.userId });

    return this.repository.model.findOneBy({ id: body.otpId });
  }
}
