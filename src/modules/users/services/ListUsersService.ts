import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';

interface IListUsersResponse {
  items: User[];
  pages: number;
  total: number;
}

interface IListUsersDTO {
  cpf?: string;
  email?: string;
  limit?: number;
  name?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  phone?: string;
  sort?: string;
}

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    cpf,
    email,
    limit,
    name,
    order = 'ASC',
    page = 1,
    phone,
    sort = 'name',
  }: IListUsersDTO): Promise<IListUsersResponse> {
    const skip = (page - 1) * (limit || 0);

    const { items, pages, total } = await this.usersRepository.findAll({
      cpf,
      email,
      name,
      order,
      phone,
      skip,
      sort,
      take: limit,
    });

    return { items, pages, total };
  }
}

export default ListUsersService;
