import ResetPasswordsService from '@modules/users/services/ResetPasswordsService';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ResetPasswordsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;

    const resetPassword = container.resolve(ResetPasswordsService);

    const user = await resetPassword.execute({
      password,
      token,
    });

    return response.json(instanceToPlain(user));
  }
}
