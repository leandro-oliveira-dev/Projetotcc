import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

interface ITokenDecoded {
  userId: string;
  iat: string;
  exp: string;
}

export interface AuthenticatedRequest extends Request {
  authenticated?: ITokenDecoded;
}

export async function authMiddleware(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) {
  const token = request.header('Authorization');

  if (!token) {
    return response.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(
    token.split('Bearer')[1].trim(),
    String(process.env.SECRET_KEY),
    (err, authenticated) => {
      if (err) {
        return response.status(403).json({ message: 'Forbidden' });
      }

      request.authenticated = authenticated as any;

      next();
    }
  );
}
