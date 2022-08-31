import { Request, Response, NextFunction } from 'express';

import AppError, { AppErrorType } from '@shared/errors/AppError';

interface IAuthLevelMiddleware {
  (request: Request, response: Response, next: NextFunction): void;
}

export default function ensureAuthorized(
  requiredFeatures: Array<string>,
): IAuthLevelMiddleware {
  function authorize(request: Request, response: Response, next: NextFunction) {
    const { featureGroup } = request.user;

    if (
      !featureGroup.features.find((userFeature) =>
        requiredFeatures.includes(userFeature.key),
      )
    ) {
      throw new AppError(AppErrorType.sessions.insufficientPrivilege, 403);
    }

    return next();
  }

  return authorize;
}
