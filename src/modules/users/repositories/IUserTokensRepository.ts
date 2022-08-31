import UserToken from '../infra/typeorm/entities/UserToken';

export default interface IUserTokensRepository {
  deleteByToken(token: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  findByToken(token: string): Promise<UserToken | null>;
  generate(userId: string): Promise<UserToken>;
}
