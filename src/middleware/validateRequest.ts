import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import sanitize from 'mongo-sanitize';
import { ErrorObject } from '../utils/error';

export const validateRequest = (schema: Joi.ObjectSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    let dataToValidate;

    // Determine the source of data to validate
    switch (source) {
      case 'body':
        dataToValidate = req.body;
        break;
      case 'query':
        dataToValidate = req.query;
        break;
      case 'params':
        dataToValidate = req.params;
        break;
      default:
        dataToValidate = req.body;
    }

    const sanitizedData = sanitize(dataToValidate);
    
    const { error } = schema.validate(sanitizedData);
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return next(new ErrorObject(errorMessage, 400));
    }
    
    req[source] = sanitizedData; // Assign sanitized data back to the request object
    next();
  };
};
