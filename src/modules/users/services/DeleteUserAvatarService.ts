import { injectable, inject } from 'tsyringe';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError, { AppErrorType } from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IDeleteUserAvatarServiceDTO {
  userId: string;
}

@injectable()
class DeleteUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ userId }: IDeleteUserAvatarServiceDTO): Promise<User> {
    const user = await this.usersRepository.findByIdDetailed({
      userId,
    });

    if (!user) {
      throw new AppError(AppErrorType.users.notFound);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
      user.avatar = null;
    }

    return this.usersRepository.save(user);
  }
}

export default DeleteUserAvatarService;
