import { Router } from 'express';

const routes = Router();

// Users Routes
routes.use('/users', usersRoutes);

export default routes;
