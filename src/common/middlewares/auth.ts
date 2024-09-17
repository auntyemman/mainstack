import { Request, Response, NextFunction } from 'express';
import { AuthenticationService } from '../../user/authentication/authentication.service';
import { NotAuthorizedError } from '../utils/custom_error';

/**
 * Authentication middleware that verifies the JWT token passed in the
 * Authorization header. If the token is valid, it sets the user object in
 * the response locals and calls the next middleware. If the token is invalid,
 * it throws a NotAuthorizedError.
 */
export const authUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new NotAuthorizedError();
    }

    const token = authorizationHeader.split(' ')[1];
    const decoded = await AuthenticationService.verifyJWT(token);
    res.locals.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};
