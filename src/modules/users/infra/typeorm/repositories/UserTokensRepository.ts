import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import { Repository } from 'typeorm';

import dataSource from '@shared/infra/typeorm';

import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = dataSource.getRepository(UserToken);
  }

  public async deleteByToken(token: string): Promise<void> {
    await this.ormRepository.delete({ token });
  }

  public async deleteByUserId(userId: string): Promise<void> {
    const existentTokens = await this.ormRepository.find({
      where: { userId },
    });

    const existentTokensIds = existentTokens.map((token) => token.id);

    if (existentTokensIds.length) {
      await this.ormRepository.delete(existentTokensIds);
    }
  }

  public async findByToken(token: string): Promise<UserToken | null> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    return userToken;
  }

  public async generate(userId: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      userId,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }
}

export default UserTokensRepository;
