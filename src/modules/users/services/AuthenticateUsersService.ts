import authConfig from '@config/auth';
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import AppError, { AppErrorType } from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IAuthenticateUsersServiceDTO {
  email: string;
  password: string;
}

interface IAuthenticateUsersServiceResponse {
  refreshToken: string;
  token: string;
  user: User;
}

@injectable()
class AuthenticateUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    password,
  }: IAuthenticateUsersServiceDTO): Promise<IAuthenticateUsersServiceResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(AppErrorType.sessions.invalidCredentials);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError(AppErrorType.sessions.invalidCredentials);
    }

    const { expiresIn, secret } = authConfig.jwts;

    const token = sign(
      {
        expiresIn,
      },
      secret,
      {
        subject: user.id,
      },
    );

    await this.userTokensRepository.deleteByUserId(user.id);

    const { token: refreshToken } = await this.userTokensRepository.generate(
      user.id,
    );

    return {
      refreshToken,
      token,
      user,
    };
  }
}

export default AuthenticateUsersService;
