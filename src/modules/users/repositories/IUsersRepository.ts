import ICheckExistingUsersDTO from '../dtos/ICheckExistingUsersDTO';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IListUserDTO from '../dtos/IListUserDTO';
import IListUserResponseDTO from '../dtos/IListUserResponseDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUsersRepository {
  checkExistingUsers(data: ICheckExistingUsersDTO): Promise<User[]>;
  create(data: ICreateUserDTO): Promise<User>;
  delete(userId: string): Promise<void>;
  findAll(data: IListUserDTO): Promise<IListUserResponseDTO>;
  findByEmail(email: string): Promise<User | null>;
  findById(userId: string): Promise<User | null>;
  save(user: Omit<User, 'getAvatarUrl'>): Promise<User>;
}
