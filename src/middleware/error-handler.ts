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

const ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let error = err instanceof ErrorObject ? err : new ErrorObject(err.message, 500);

  if (NODE_ENV === "development") {
    devError(error, res);
  } else {
    if (err.name === "CastError") error = handleCastError(err as any);
    if (err.name === "JsonWebTokenError") error = handleWebTokenError(err);
    prodError(error, res);
  }
};

export default ErrorHandler;
