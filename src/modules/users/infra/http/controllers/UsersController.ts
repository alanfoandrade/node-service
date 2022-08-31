import CreateUsersService from '@modules/users/services/CreateUsersService';
import DeleteUsersService from '@modules/users/services/DeleteUsersService';
import ListUsersService from '@modules/users/services/ListUsersService';
import ShowUsersService from '@modules/users/services/ShowUsersService';
import UpdateUsersService from '@modules/users/services/UpdateUsersService';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { bio, cpf, email, name, phone } = request.body;

    const createUser = container.resolve(CreateUsersService);

    const user = await createUser.execute({
      bio,
      cpf,
      email: String(email).toLowerCase(),
      name,
      phone,
    });

    return response.json(instanceToPlain(user));
  }

  public async destroy(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { user_id: userId } = request.params;

    const deleteUser = container.resolve(DeleteUsersService);

    await deleteUser.execute(userId);

    return response.json();
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { cpf, email, limit, name, order, page, phone, sort } = request.query;

    const listUsers = container.resolve(ListUsersService);

    const data = await listUsers.execute({
      cpf: cpf ? String(cpf) : undefined,
      email: email ? String(email).toLowerCase() : undefined,
      limit: limit ? Number(limit) : undefined,
      name: name ? String(name) : undefined,
      order: order ? (order as 'ASC' | 'DESC') : undefined,
      page: page ? Number(page) : undefined,
      phone: phone ? String(phone) : undefined,
      sort: sort ? String(sort) : undefined,
    });

    return response.json(instanceToPlain(data));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { user_id: userId } = request.params;

    const showUser = container.resolve(ShowUsersService);

    const user = await showUser.execute(userId);

    return response.json(instanceToPlain(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { user_id: userId } = request.params;
    const { bio, cpf, email, name, phone } = request.body;

    const updateUsers = container.resolve(UpdateUsersService);

    const user = await updateUsers.execute({
      bio,
      cpf,
      email: String(email).toLowerCase(),
      name,
      phone,
      userId,
    });

    return response.json(instanceToPlain(user));
  }
}
