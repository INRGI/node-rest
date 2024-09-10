import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from 'helpers/ApiError';

export const validateBody = (schema: Joi.ObjectSchema<any>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return next(new ApiError(400, error));
    }

    next();
  };
};
