import uploadConfig from '@config/upload';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import UserAvatarsController from '../controllers/UserAvatarsController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const userAvatarsRouter = Router();

const userAvatarsController = new UserAvatarsController();
const upload = multer(uploadConfig.multer);

userAvatarsRouter.use(ensureAuthenticated);

// PATCH: baseURL/avatars/users/:user_id
/**
 * Update User avatar.
 */
userAvatarsRouter.patch(
  '/:user_id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      user_id: Joi.string().uuid().required(),
    }),
  }),
  upload.single('avatar'),
  userAvatarsController.update,
);

// DELETE: baseURL/avatars/users/:user_id
/**
 * Delete User avatar.
 */
userAvatarsRouter.delete(
  '/:user_id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      user_id: Joi.string().uuid().required(),
    }),
  }),
  userAvatarsController.destroy,
);

export default userAvatarsRouter;
