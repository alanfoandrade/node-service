import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import SessionsController from '../controllers/SessionsController';
import identifyUserRequest from '../middlewares/identifyUserRequest';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

// POST: baseURL/sessions
/**
 * Authenticate Session.
 */
sessionsRouter.post(
  '/',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      appref: Joi.string(),
    }).unknown(),
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().lowercase().required(),
      password: Joi.string().required(),
    }),
  }),
  sessionsController.create,
);

// PUT: baseURL/sessions/refresh
/**
 * Update Session token.
 */
sessionsRouter.put(
  '/refresh',
  celebrate({
    [Segments.BODY]: Joi.object({
      refreshToken: Joi.string().uuid().required(),
    }),
  }),
  identifyUserRequest,
  sessionsController.update,
);

export default sessionsRouter;
