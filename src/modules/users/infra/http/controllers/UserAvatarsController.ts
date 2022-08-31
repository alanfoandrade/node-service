import DeleteUserAvatarService from '@modules/users/services/DeleteUserAvatarService';
import UpdateUserAvatarsService from '@modules/users/services/UpdateUserAvatarsService';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError, { AppErrorType } from '@shared/errors/AppError';

export default class UserAvatarsController {
  public async destroy(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { user_id: userId } = request.params;

    const deleteUserAvatar = container.resolve(DeleteUserAvatarService);

    await deleteUserAvatar.execute(userId);

    return response.json();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { user_id: userId } = request.params;

    if (!request.file?.filename) {
      throw new AppError(AppErrorType.files.notFound);
    }

    const updateUserAvatars = container.resolve(UpdateUserAvatarsService);

    const user = await updateUserAvatars.execute({
      avatarFilename: request.file.filename,
      userId,
    });

    return response.json(instanceToPlain(user));
  }
}
