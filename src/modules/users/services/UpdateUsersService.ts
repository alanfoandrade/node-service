import { plainToInstance } from 'class-transformer';
import { injectable, inject } from 'tsyringe';

import AppError, { AppErrorType } from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IUpdateUsersServiceDTO {
  bio?: string;
  cpf: string;
  email: string;
  featureGroupId?: string;
  name: string;
  password?: string;
  phone?: string;
  userId: string;
  ventureId?: string;
}

@injectable()
class UpdateUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    bio,
    cpf,
    email,
    featureGroupId,
    name,
    password,
    phone,
    userId,
    ventureId,
  }: IUpdateUsersServiceDTO): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError(AppErrorType.users.notFound);
    }

    const existingUsers = await this.usersRepository.checkExistingUsers({
      cpf,
      email,
    });

    const checkUserExists = existingUsers.find((usr) => usr.id !== userId);

    if (checkUserExists) {
      if (checkUserExists.email === email) {
        throw new AppError(AppErrorType.users.emailAlreadyInUse);
      }

      throw new AppError(AppErrorType.users.cpfAlreadyInUse);
    }

    if (password) {
      user.password = await this.hashProvider.generateHash(password);
    }

    const updatedUser = await this.usersRepository.save({
      ...user,
      bio,
      cpf,
      email,
      featureGroupId: featureGroupId || user.featureGroupId,
      name,
      phone,
      ventureId,
    });

    return plainToInstance(User, updatedUser);
  }
}

export default UpdateUsersService;
