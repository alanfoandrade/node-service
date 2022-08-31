import UpdateUsersProfileService from '@modules/users/services/UpdateUsersProfileService';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UsersProfileController {
  public async update(request: Request, response: Response): Promise<Response> {
    const authenticatedUser = request.user;
    const { bio, cpf, email, name, password, phone } = request.body;

    const updateUsersProfile = container.resolve(UpdateUsersProfileService);

    const user = await updateUsersProfile.execute({
      authenticatedUser,
      bio,
      cpf,
      email: String(email).toLowerCase(),
      name,
      password,
      phone,
    });

    return response.json(instanceToPlain(user));
  }
}
