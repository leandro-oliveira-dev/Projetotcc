import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

interface User {
  name: string;
  email: string;
  ra: string;
}

interface AuthenticatedRequest extends Request {
  user?: User;
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

  jwt.verify(token, String(process.env.SECRET_KEY), (err, user) => {
    if (err) {
      return response.status(403).json({ message: 'Forbidden' });
    }

    request.user = user as User;

    next();
  });
}
