declare namespace Express {
  type SessionUser = {
    id: string;
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface Request {
    user: SessionUser;
  }
}
