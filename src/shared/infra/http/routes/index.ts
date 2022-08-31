import usersRouter from '@modules/users/infra/http/routes/users.routes';
import { Router } from 'express';

const routes = Router();

// Users Routes
routes.use('/users', usersRouter);

export default routes;
