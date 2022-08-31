import { injectable, inject } from 'tsyringe';

import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

@injectable()
class SendForgotPasswordEmailService {
  get key(): string {
    return '[NODE-SERVICE]:ForgotPasswordEmail';
  }

  constructor(
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute(messageData: ISendMailDTO): Promise<void> {
    await this.mailProvider.sendMail(messageData);
  }
}

export default SendForgotPasswordEmailService;
