import { logger } from '.';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

class MailSenderHelper {
  private transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null;
  private senderEmail: string | null;
  constructor() {
    this.senderEmail = 'khadkarajan99999@gmail.com';
    this.transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.senderEmail,
        pass: 'fiaqhjtvuynrngnp',
      },
    });
  }

  async sendMail(to: string, subject: string, content: string) {
    try {
      await this.transport.sendMail({ from: this.senderEmail, to, subject, html: `<p>Hello,</p></br><p>${content}</p>` });
      logger.debug('Mail sent successfully');
    } catch (error: any) {
      logger.debug(error.message);
      throw error;
    }
  }
}

export default new MailSenderHelper();
