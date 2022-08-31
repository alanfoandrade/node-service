import ICheckExistingUsersDTO from '@modules/users/dtos/ICheckExistingUsersDTO';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IListUserDTO from '@modules/users/dtos/IListUserDTO';
import IListUserResponseDTO from '@modules/users/dtos/IListUserResponseDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';

import dataSource from '@shared/infra/typeorm';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = dataSource.getRepository(User);
  }

  public async checkExistingUsers({
    cpf,
    email,
  }: ICheckExistingUsersDTO): Promise<User[]> {
    const where = [{ cpf }, { email }];

    const user = await this.ormRepository.find({
      where,
    });

    return user;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }

  public async delete(userId: string): Promise<void> {
    await this.ormRepository.delete(userId);
  }

  public async findAll({
    cpf,
    email,
    name,
    order,
    phone,
    skip,
    sort,
    take,
  }: IListUserDTO): Promise<IListUserResponseDTO> {
    const usersQuery = this.ormRepository
      .createQueryBuilder('users')
      .skip(skip)
      .take(take);

    if (cpf) {
      usersQuery.andWhere({ cpf: ILike(`%${cpf}%`) });
    }

    if (email) {
      usersQuery.andWhere({ email: ILike(`%${email}%`) });
    }

    if (name) {
      usersQuery.andWhere({ name: ILike(`%${name}%`) });
    }

    if (phone) {
      usersQuery.andWhere({ phone: ILike(`%${phone}%`) });
    }

    if (sort === 'createdAt') {
      usersQuery.orderBy(`users.${sort}`, order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      usersQuery.orderBy(`users.${sort}`, order);
    }

    usersQuery.addOrderBy('users.updatedAt', 'ASC');

    const [items, total] = await usersQuery.getManyAndCount();

    const pages = take ? Math.ceil(total / take) : 1;

    return { items, pages, total };
  }

  public async findByEmail(email: string): Promise<User | null> {
    const where: FindOptionsWhere<User> = {
      email,
    };

    const user = await this.ormRepository.findOne({
      where,
    });

    return user;
  }

  public async findById(userId: string): Promise<User | null> {
    const user = await this.ormRepository.findOne({ where: { id: userId } });

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
