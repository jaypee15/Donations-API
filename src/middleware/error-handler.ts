import { Request, Response, NextFunction } from 'express';
import { ErrorObject } from "../utils/error";

const { NODE_ENV } = process.env;

const handleCastError = (err: { path: string; value: any }): ErrorObject => {
  const message = `The ${err.path} does not contain ${err.value}`;
  return new ErrorObject(message, 400);
};

const handleWebTokenError = (err: Error): ErrorObject => new ErrorObject(err.message, 401);

const devError = (err: ErrorObject, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const prodError = (err: ErrorObject, res: Response) => {
  if (err.operational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Handle duplicate key error
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(409).json({
      status: 'error',
      message: 'Email already in use. Please use a different email address.',
    });
  }

  // Handle other known errors
  if (err instanceof ErrorObject) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Handle generic server errors
  console.error(err); // Log the error for debugging
  res.status(500).json({
    status: 'error',
    message: 'An error occurred. Please try again later.',
  });
};

export default ErrorHandler;
