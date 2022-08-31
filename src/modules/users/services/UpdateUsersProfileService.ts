import { plainToInstance } from 'class-transformer';
import { injectable, inject } from 'tsyringe';

import AppError, { AppErrorType } from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IUpdateUsersProfileServiceDTO {
  authenticatedUser: Express.SessionUser;
  bio?: string;
  cpf: string;
  email: string;
  name: string;
  password?: string;
  phone?: string;
}

@injectable()
class UpdateUsersProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    authenticatedUser,
    bio,
    cpf,
    email,
    password,
    phone,
    ...rest
  }: IUpdateUsersProfileServiceDTO): Promise<User> {
    const user = await this.usersRepository.findById(authenticatedUser.id);

    if (!user) {
      throw new AppError(AppErrorType.users.notFound);
    }

    const existingUsers = await this.usersRepository.checkExistingUsers({
      cpf,
      email,
    });

    const checkUserExists = existingUsers.find(
      (usr) => usr.id !== authenticatedUser.id,
    );

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
      ...rest,
      bio,
      cpf,
      email,
      phone,
    });

    return plainToInstance(User, updatedUser);
  }
}

export default UpdateUsersProfileService;
