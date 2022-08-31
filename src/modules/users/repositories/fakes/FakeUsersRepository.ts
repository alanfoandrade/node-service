import ICheckExistingUsersDTO from '@modules/users/dtos/ICheckExistingUsersDTO';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IListUserDTO from '@modules/users/dtos/IListUserDTO';
import IListUserResponseDTO from '@modules/users/dtos/IListUserResponseDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { v4 as uuid } from 'uuid';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async checkExistingUsers({
    cpf,
    email,
  }: ICheckExistingUsersDTO): Promise<User[]> {
    const findUser = this.users.filter(
      (user) => user.cpf === cpf || user.email === email,
    );

    return findUser;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      id: uuid(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.users.push(user);

    return user;
  }

  public async delete(userId: string): Promise<void> {
    const findIndex = this.users.findIndex((user) => user.id === userId);

    this.users.splice(findIndex, 1);
  }

  public async findAll({
    skip,
    take,
  }: IListUserDTO): Promise<IListUserResponseDTO> {
    const users = this.users.slice(skip, take);

    const usersCount = this.users.length;

    const pages = take ? Math.ceil(usersCount / take) : 1;

    return { items: users, pages, total: usersCount };
  }

  public async findByEmail(email: string): Promise<User | null> {
    const findUser = this.users.find((user) => user.email === email);

    if (findUser) {
      Object.assign(findUser, {
        featureGroup: {
          features: [
            { key: 'USER_FULL_ACCESS', name: 'Usuários controle total' },
          ],
          key: 'ADMIN',
          name: 'Administrador',
        },
      });
    }

    return findUser || null;
  }

  public async findById(userId: string): Promise<User | null> {
    const findUser = this.users.find((user) => user.id === userId);

    return findUser || null;
  }

  public async findByIdDetailed(userId: string): Promise<User | null> {
    const findUser = this.users.find((user) => user.id === userId);

    if (findUser) {
      Object.assign(findUser, {
        featureGroup: {
          features: [
            { key: 'USER_FULL_ACCESS', name: 'Usuários controle total' },
          ],
          key: 'ADMIN',
          name: 'Administrador',
        },
      });
    }

    return findUser || null;
  }

  public async save(user: Omit<User, 'getAvatarUrl'>): Promise<User> {
    const findIndex = this.users.findIndex(
      (findUser) => findUser.id === user.id,
    );

    const updatedUser = {
      ...this.users[findIndex],
      ...user,
      updatedAt: new Date(),
    } as User;

    this.users[findIndex] = updatedUser;

    return updatedUser;
  }
}

export default FakeUsersRepository;
