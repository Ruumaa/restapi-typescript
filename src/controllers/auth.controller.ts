import { Request, Response } from 'express';
import { createUser, findEmail } from '../services/auth';
import {
  createSessionValidation,
  refreshSessionValidation,
  userValidation,
} from '../validations/auth.validation';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { checkPassword, hashing } from '../utils/hashing';
import { signJWT, verifyToken } from '../utils/jwt';

export const registerUser = async (req: Request, res: Response) => {
  req.body.user_id = uuidv4();

  const { error, value } = userValidation(req.body);

  if (error) {
    logger.error(`auth - register = ${error.details[0].message}`);
    return res.status(422).send({
      status: false,
      statusCode: 422,
      message: error.details[0].message,
    });
  }

  try {
    // hashing password
    value.password = `${hashing(value.password)}`;
    await createUser(value);
    return res
      .status(201)
      .json({ status: true, statusCode: 201, message: 'Register success' });
  } catch (error) {
    logger.error(`auth - register = ${error}`);
    return res.status(422).send({
      status: false,
      statusCode: 422,
      message: error,
    });
  }
};

export const createSession = async (req: Request, res: Response) => {
  const { error, value } = createSessionValidation(req.body);

  if (error) {
    logger.error(`auth - createSession = ${error.details[0].message}`);
    return res.status(422).send({
      status: false,
      statusCode: 422,
      message: error.details[0].message,
    });
  }

  try {
    const user: any = await findEmail(value.email);
    const isValid = checkPassword(value.password, user.password);
    if (!isValid)
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: 'Invalid email or password',
      });

    const accessToken = signJWT({ ...user }, { expiresIn: '1d' });
    const refreshToken = signJWT({ ...user }, { expiresIn: '7d' });
    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: 'Login success',
      data: { accessToken, refreshToken },
    });
  } catch (error: any) {
    logger.error(`auth - createSession = ${error.message}`);
    return res.status(422).send({
      status: false,
      statusCode: 422,
      message: error.message,
    });
  }
};

export const refreshSession = async (req: Request, res: Response) => {
  const { error, value } = refreshSessionValidation(req.body);

  if (error) {
    logger.error(`auth - refreshSession = ${error.details[0].message}`);
    return res.status(422).send({
      status: false,
      statusCode: 422,
      message: error.details[0].message,
    });
  }

  try {
    // mengambil nilai token lalu memverfikasi
    const { decoded }: any = verifyToken(value.refreshToken);

    // memastikan email ada
    const user = await findEmail(decoded._doc.email);
    if (!user) return false;

    // membuat accessToken baru
    const accessToken = signJWT({ ...user }, { expiresIn: '1d' });
    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: 'Refresh session success',
      data: { accessToken },
    });
  } catch (error: any) {
    logger.error(`auth - refreshToken = ${error.message}`);
    return res.status(422).send({
      status: false,
      statusCode: 422,
      message: error.message,
    });
  }
};
