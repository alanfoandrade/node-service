import { injectable, inject } from 'tsyringe';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError, { AppErrorType } from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IUpdateUserAvatarsServiceDTO {
  avatarFilename?: string;
  userId: string;
}

@injectable()
class UpdateUserAvatarsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    avatarFilename,
    userId,
  }: IUpdateUserAvatarsServiceDTO): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError(AppErrorType.users.notFound);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
      user.avatar = null;
    }

    if (avatarFilename) {
      const fileName = await this.storageProvider.saveFile(avatarFilename);

      user.avatar = fileName;
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateUserAvatarsService;
