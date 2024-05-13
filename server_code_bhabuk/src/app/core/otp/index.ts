import OtpService from './service';
import OtpRepository from './repository';

const otpRepository = new OtpRepository();
const otpService = new OtpService(otpRepository);

export * from './interface';
export { otpRepository, otpService };
