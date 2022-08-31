import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';

import AppError, { AppErrorType } from '@shared/errors/AppError';

import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IDeleteUsersServiceDTO {
  authenticatedUser: Express.SessionUser;
  userId: string;
}

@injectable()
class DeleteUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({
    authenticatedUser,
    userId,
  }: IDeleteUsersServiceDTO): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError(AppErrorType.users.notFound);
    }

    // Customer users can only delete their own profile and guests
    if (
      authenticatedUser.featureGroup.key === 'CUSTOMER' &&
      userId !== authenticatedUser.id &&
      user.hostId !== authenticatedUser.id
    ) {
      throw new AppError(AppErrorType.users.notFound);
    }

    await this.userTokensRepository.deleteByUserId(userId);

    return this.usersRepository.delete(userId);
  }
}

export default DeleteUsersService;
