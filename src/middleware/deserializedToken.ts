import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

const deserializedToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers.authorization?.replace(/^Bearer\s/, '');
  if (!accessToken) {
    return next();
  }
  const { decoded, expired } = verifyToken(accessToken);
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired) {
    return next();
  }

  return next();
};

export default deserializedToken;
