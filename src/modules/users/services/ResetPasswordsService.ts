import { differenceInHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError, { AppErrorType } from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IResetPasswordsServiceDTO {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    password,
    token,
  }: IResetPasswordsServiceDTO): Promise<User> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError(AppErrorType.sessions.tokenNotFound);
    }

    if (differenceInHours(Date.now(), userToken.createdAt) > 2) {
      throw new AppError(AppErrorType.sessions.expiredToken);
    }

    const user = await this.usersRepository.findByIdDetailed(userToken.userId);

    if (!user) {
      throw new AppError(AppErrorType.users.notFound);
    }

    user.password = await this.hashProvider.generateHash(password);
    user.confirmPending = false;

    await this.userTokensRepository.deleteByUserId(user.id);

    const updatedUser = await this.usersRepository.save(user);

    return updatedUser;
  }
}

export default ResetPasswordsService;
