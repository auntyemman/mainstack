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
   const authentication = new AuthenticationService();
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new NotAuthorizedError();
    }

    const token = authorizationHeader.split(' ')[1];
    const decoded = await AuthenticationService.verifyJWT(token);
    
    res.locals.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      // If access token is expired, check for refresh token
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        next(err);
        // throw new NotAuthorizedError();
      }

      // Verify the refresh token
      const decodedRefreshToken = await AuthenticationService.verifyJWT(refreshToken);

      // Issue new access token
      const newAccessToken = authentication.createAccessToken({ user: decodedRefreshToken });

      // Set new access token in response header
      res.setHeader('Authorization', `Bearer ${newAccessToken}`);

      res.locals.user = decodedRefreshToken; // Set the user data from refresh token
      return next(); // Proceed with new access token
    }
    next(err);
  }
};
