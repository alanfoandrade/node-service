import sentryConfig from '@config/sentry';
import uploadConfig from '@config/upload';
import globalErrorHandler from '@middlewares/globalErrorHandler';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import '@shared/container';

import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

Sentry.init({
  ...sentryConfig,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
    new Tracing.Integrations.Mysql(),
  ],
  tracesSampleRate: 0.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(globalErrorHandler);

export { app };
