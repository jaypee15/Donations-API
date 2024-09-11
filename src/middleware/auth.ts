import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { ErrorObject } from '../utils/error';
import { IUser } from '../models/userModel';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: IUser | false, info: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new ErrorObject('Unauthorized', 401));
    }
    req.user = user;
    next();
  })(req, res, next);
};
