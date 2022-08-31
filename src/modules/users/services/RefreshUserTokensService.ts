import authConfig from '@config/auth';
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import AppError, { AppErrorType } from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRefreshUserTokensServiceDTO {
  refreshToken: string;
  userId: string;
}

interface IRefreshUserTokensServiceResponse {
  refreshToken: string;
  token: string;
}

@injectable()
class RefreshUserTokensService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({
    refreshToken,
    userId,
  }: IRefreshUserTokensServiceDTO): Promise<IRefreshUserTokensServiceResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError(AppErrorType.users.notFound);
    }

    const checkRefreshToken = await this.userTokensRepository.findByToken(
      refreshToken,
    );

    if (!checkRefreshToken || checkRefreshToken.userId !== userId) {
      throw new AppError(AppErrorType.sessions.invalidRefreshToken);
    }

    const { expiresIn, secret } = authConfig.jwts;

    const token = sign({}, secret, {
      expiresIn,
      subject: user.id,
    });

    await this.userTokensRepository.deleteByToken(refreshToken);

    const { token: newRefreshToken } = await this.userTokensRepository.generate(
      user.id,
    );

    return {
      refreshToken: newRefreshToken,
      token,
    };
  }
}

export default RefreshUserTokensService;
