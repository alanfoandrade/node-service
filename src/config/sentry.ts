import { NodeOptions } from '@sentry/node';

const sentryConfig: NodeOptions = {
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
};

export default sentryConfig;
