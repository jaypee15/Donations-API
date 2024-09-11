import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ErrorObject } from '../utils/error';

export const validateRequest = (schema: Joi.ObjectSchema, source: 'body' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(source === 'body' ? req.body : req.query);
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return next(new ErrorObject(errorMessage, 400));
    }
    next();
  };
};
