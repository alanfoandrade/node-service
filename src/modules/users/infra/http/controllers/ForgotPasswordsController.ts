import CreateForgotPasswordEmailsService from '@modules/users/services/CreateForgotPasswordEmailService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ForgotPasswordsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const createForgotPasswordEmail = container.resolve(
      CreateForgotPasswordEmailsService,
    );

    await createForgotPasswordEmail.execute(String(email).toLowerCase());

    return response.status(204).json();
  }
}
