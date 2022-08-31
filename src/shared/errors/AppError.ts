export const AppErrorType = {
  files: {
    notFound: 'file-not-found',
  },
  sessions: {
    authenticationError: 'authentication-error',
    expiredToken: 'expired-token',
    insufficientPrivilege: 'insufficient-privilege',
    invalidCredentials: 'invalid-credentials',
    invalidRefreshToken: 'invalid-refresh-token',
    tokenNotFound: 'token-not-found',
  },
  users: {
    cpfAlreadyInUse: 'cpf-already-in-use',
    emailAlreadyInUse: 'email-already-in-use',
    notFound: 'user-not-found',
  },
};

class AppError {
  public readonly appErrorType: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly metadata?: { [key: string]: any };

  public readonly statusCode: number;

  constructor(
    appErrorType: string,
    // eslint-disable-next-line default-param-last
    statusCode = 400,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: { [key: string]: any },
  ) {
    this.appErrorType = appErrorType;
    this.metadata = metadata;
    this.statusCode = statusCode;
  }
}

export default AppError;
