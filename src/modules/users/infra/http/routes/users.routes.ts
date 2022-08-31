import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import UsersController from '../controllers/UsersController';
import UsersProfileController from '../controllers/UsersProfileController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const usersController = new UsersController();
const usersProfileController = new UsersProfileController();

usersRouter.use(ensureAuthenticated);

// GET: baseURL/users
/**
 * List Users.
 */
usersRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      cpf: Joi.string(),
      email: Joi.string(),
      limit: Joi.number().positive().integer(),
      name: Joi.string(),
      order: Joi.string().valid('ASC', 'DESC'),
      page: Joi.number().positive().integer(),
      phone: Joi.string(),
      sort: Joi.string().valid('cpf', 'name', 'email', 'phone', 'createdAt'),
    }),
  }),
  usersController.index,
);

// GET: baseURL/users/:user_id
/**
 * Show User.
 */
usersRouter.get(
  '/:user_id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      user_id: Joi.string().uuid().required(),
    }),
  }),
  usersController.show,
);

// POST: baseURL/users
/**
 * Register User.
 */
usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      bio: Joi.string().allow(null),
      cpf: Joi.string().length(11).regex(/^\d+$/).required(),
      email: Joi.string().email().lowercase().required(),
      name: Joi.string().required(),
      phone: Joi.string().allow(null),
    }),
  }),
  usersController.create,
);

// PUT: baseURL/users/profile
/**
 * Update User Profile.
 */
usersRouter.put(
  '/profile',
  celebrate({
    [Segments.BODY]: Joi.object({
      bio: Joi.string().allow(null),
      cpf: Joi.string().length(11).regex(/^\d+$/).required(),
      email: Joi.string().email().lowercase().required(),
      name: Joi.string().required(),
      password: Joi.string().allow(null),
      passwordConfirmation: Joi.string().equal(Joi.ref('password')),
      phone: Joi.string().allow(null),
    }),
  }),
  usersProfileController.update,
);

// PUT: baseURL/users/:user_id
/**
 * Update User.
 */
usersRouter.put(
  '/:user_id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      user_id: Joi.string().uuid().required(),
    }),
    [Segments.BODY]: Joi.object({
      bio: Joi.string().allow(null),
      cpf: Joi.string().length(11).regex(/^\d+$/).required(),
      email: Joi.string().email().lowercase().required(),
      name: Joi.string().required(),
      phone: Joi.string().allow(null),
    }),
  }),
  usersController.update,
);

// DELETE: baseURL/users/:user_id
/**
 * Delete User.
 */
usersRouter.delete(
  '/:user_id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      user_id: Joi.string().uuid().required(),
    }),
  }),
  usersController.destroy,
);

export default usersRouter;
