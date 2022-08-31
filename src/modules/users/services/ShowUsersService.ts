import { injectable, inject } from 'tsyringe';

import AppError, { AppErrorType } from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IShowUsersServiceDTO {
  hostId?: string;
  userId: string;
}

@injectable()
class ShowUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    hostId,
    userId,
  }: IShowUsersServiceDTO): Promise<User> {
    const user = await this.usersRepository.findByIdDetailed({
      hostId,
      userId,
    });

    if (!user) {
      throw new AppError(AppErrorType.users.notFound);
    }

    return user;
  }
}

export default ShowUsersService;
