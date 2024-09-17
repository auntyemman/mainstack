import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../common/configs';
import { BadRequestError } from '../../common/utils/custom_error';
import { JWT_Expiration } from './authentication.dto';

export class AuthenticationService {
  constructor() {}

  createRefreshToken = async (payload: object) => {
    return this.token(payload, JWT_Expiration.createRefreshToken);
  };

  createAccessToken = (payload: object) => {
    return this.token(payload, JWT_Expiration.accessToken);
  };

  static verifyJWT = async (token: string) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET); // as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new BadRequestError('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new BadRequestError('Invalid token');
      }
    }
  };

  private token = (payload: object, expiration: string) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: expiration });
  };
}
