import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import { v4 as uuid } from 'uuid';

import IUserTokensRepository from '../IUserTokensRepository';

class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async deleteByToken(token: string): Promise<void> {
    const filteredTokens = this.userTokens.filter(
      (item) => item.token !== token,
    );

    this.userTokens = filteredTokens;
  }

  public async deleteByUserId(userId: string): Promise<void> {
    const filteredTokens = this.userTokens.filter(
      (token) => token.userId !== userId,
    );

    this.userTokens = filteredTokens;
  }

  public async findByToken(token: string): Promise<UserToken | null> {
    const userToken = this.userTokens.find(
      (findToken) => findToken.token === token,
    );

    return userToken || null;
  }

  public async generate(userId: string): Promise<UserToken> {
    const userToken = new UserToken();

    this.userTokens.push({
      ...userToken,
      createdAt: new Date(),
      id: uuid(),
      token: uuid(),
      updatedAt: new Date(),
      userId,
    });

    return userToken;
  }
}

export default FakeUserTokensRepository;
