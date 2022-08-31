import path from 'path';
import { injectable, inject } from 'tsyringe';

import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import AppError, { AppErrorType } from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

@injectable()
class CreateForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
  ) {}

  public async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(AppErrorType.users.notFound);
    }

    await this.userTokensRepository.deleteByUserId(user.id);
    const { token } = await this.userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'user_forgot_password.hbs',
    );

    const messageData = {
      subject: `[NODE-SERVICE] Recuperação de senha`,
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          link: `${process.env.APP_WEB_URL}/users/passwords/reset?token=${token}`,
          name: user.name,
          token,
        },
      },
      to: {
        email: user.email,
        name: user.name,
      },
    } as ISendMailDTO;

    await this.queueProvider.addJob({
      jobData: messageData,
      key: '[NODE-SERVICE]:ForgotPasswordEmail',
    });
  }
}

export default CreateForgotPasswordEmailService;
