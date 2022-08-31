import { injectable, inject } from 'tsyringe';
import { v4 as uuid } from 'uuid';

import AppError, { AppErrorType } from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface ICreateUsersServiceDTO {
  bio?: string;
  cpf: string;
  email: string;
  name: string;
  phone?: string;
  ventureId?: string;
}

@injectable()
class CreateUsersService {
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
    name,
    phone,
    ventureId,
  }: ICreateUsersServiceDTO): Promise<User> {
    const existingUsers = await this.usersRepository.checkExistingUsers({
      cpf,
      email,
    });

    const checkUserExists = existingUsers.find((usr) => usr);

    if (checkUserExists) {
      if (checkUserExists.email === email) {
        throw new AppError(AppErrorType.users.emailAlreadyInUse);
      }

      throw new AppError(AppErrorType.users.cpfAlreadyInUse);
    }

    const hashedPassword = await this.hashProvider.generateHash(uuid());

    const userPayload = {
      bio,
      cpf,
      email,
      featureGroupId: 'lorem_id',
      name,
      password: hashedPassword,
      phone,
      ventureId,
    };

    const user = await this.usersRepository.create(userPayload);

    return user;
  }
}

export default CreateUsersService;
