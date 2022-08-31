import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import ForgotPasswordsController from '../controllers/ForgotPasswordsController';
import ResetPasswordsController from '../controllers/ResetPasswordsController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordsController();
const resetPasswordController = new ResetPasswordsController();

// POST: baseURL/users
/**
 * Request forgot password email.
 */
passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().lowercase().required(),
    }),
  }),
  forgotPasswordController.create,
);

// POST: baseURL/users
/**
 * Reset pasword.
 */
passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: Joi.object({
      password: Joi.string().min(6).required(),
      passwordConfirmation: Joi.string().valid(Joi.ref('password')).required(),
      token: Joi.string().uuid().required(),
    }),
  }),
  resetPasswordController.create,
);

export default passwordRouter;
