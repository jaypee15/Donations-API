import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import sanitize from 'mongo-sanitize';
import { ErrorObject } from '../utils/error';

export const validateRequest = (schema: Joi.ObjectSchema, source: 'body' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = source === 'body' ? req.body : req.query;
    const sanitizedData = sanitize(dataToValidate);
    
    const { error } = schema.validate(sanitizedData);
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return next(new ErrorObject(errorMessage, 400));
    }
    
    req[source] = sanitizedData;
    next();
  };
};
