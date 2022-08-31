import AuthenticateUsersService from '@modules/users/services/AuthenticateUsersService';
import RefreshUserTokensService from '@modules/users/services/RefreshUserTokensService';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUsersService);

    const { refreshToken, token, user } = await authenticateUser.execute({
      email: String(email).toLowerCase(),
      password,
    });

    return response.json({ refreshToken, token, user: instanceToPlain(user) });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { refreshToken } = request.body;

    const refreshTokens = container.resolve(RefreshUserTokensService);

    const { refreshToken: newRefreshToken, token } =
      await refreshTokens.execute({
        refreshToken,
        userId: id,
      });

    return response.json({
      refreshToken: newRefreshToken,
      token,
    });
  }
}
