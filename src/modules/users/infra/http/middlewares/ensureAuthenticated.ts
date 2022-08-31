import authConfig from '@config/auth';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError, { AppErrorType } from '@shared/errors/AppError';

export type SessionUser = {
  id: string;
};

interface ITokenPayload {
  exp: number;
  iat: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError(AppErrorType.sessions.tokenNotFound, 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as ITokenPayload;

    request.user = {
      id: sub,
    };

    return next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new AppError(err.message, 401);
  }
}
