declare namespace Express {
  type SessionFeature = {
    key: string;
    name: string;
  };

  type SessionFeatureGroup = {
    key: string;
    name: string;
  };

  type SessionUser = {
    id: string;
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface Request {
    user: SessionUser;
  }
}
