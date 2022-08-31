import * as Sentry from '@sentry/node';
import { isCelebrateError } from 'celebrate';
import EscapeHtml from 'escape-html';
import { Request, Response, NextFunction } from 'express';
import http from 'http';

import AppError from '@shared/errors/AppError';

export default function globalErrorHandler(
  err: Error,
  request: Request,
  response: Response,
  _: NextFunction,
): Response {
  const errorData = {
    error: err,
    requestBody: request.body,
    requestBodyStringified: JSON.stringify(request.body),
    requestHeaders: request.headers,
    requestMethod: request.method,
    requestParams: request.params,
    requestQuery: request.query,
    requestUrl: request.url,
  };

  if (request.user) {
    Sentry.setContext('User/Customer', {
      id: request.user.id,
    });
  }

  // eslint-disable-next-line no-console
  console.error(err);

  if (isCelebrateError(err)) {
    const validation: Record<string, unknown> = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [segment, joiError] of err.details.entries()) {
      validation[segment] = {
        keys: JSON.stringify(
          joiError.details.map((detail) => EscapeHtml(detail.path.join('.'))),
        ),
        message: joiError.message,
        source: segment,
      };
    }

    const validationError = {
      error: http.STATUS_CODES[400],
      message: err.message,
      statusCode: 400,
      validation,
    };

    const segmentErrorObject = Object.entries(validation).pop()?.pop() as
      | {
          message: string;
        }
      | undefined;

    const errorTitle = segmentErrorObject?.message
      ? `Celebrate - ${segmentErrorObject.message}`
      : err.message;

    Sentry.captureException(
      { ...err, name: errorTitle },
      {
        extra: {
          ...errorData,
          validation,
        },
      },
    );

    return response.status(400).json(validationError);
  }

  if (err instanceof AppError) {
    Sentry.captureException(err, {
      extra: {
        ...errorData,
        responseMessage: err.message,
        responseMetadata: err.metadata,
        responseMetadataStringified: JSON.stringify(err.metadata),
        responseStatusCode: err.statusCode,
      },
    });

    return response.status(err.statusCode).json({
      message: err.appErrorType,
      metaData: err.metadata,
      status: 'error',
    });
  }

  Sentry.captureException(err, {
    extra: errorData,
    fingerprint: [err.message],
  });

  return response.status(500).json({
    message: 'internal-server-error',
    status: 'error',
  });
}
