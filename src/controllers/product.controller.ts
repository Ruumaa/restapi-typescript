import { NextFunction, Request, Response } from 'express';
import {
  productValidation,
  updateProductValidation,
} from '../validations/product.validation';
import { logger } from '../utils/logger';
import {
  addProductDB,
  getProductById,
  getProductDB,
  updateProductDB,
} from '../services/product.service';
import { v4 as uuidv4 } from 'uuid';

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Params
  const {
    params: { id },
  } = req;

  if (id) {
    const product = await getProductById(id);
    if (product) {
      logger.info('Get All product success');
      res.status(200).send({
        status: true,
        statusCode: 200,
        data: product,
      });
    } else {
      logger.info(`Product ${id} not found!`);
      res.status(404).send({
        status: false,
        statusCode: 404,
        data: {},
      });
    }
  } else {
    // getAll products from db
    const products: any = await getProductDB();

    logger.info('Get All product success');
    res.status(200).send({
      status: true,
      statusCode: 200,
      data: products,
    });
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.product_id = uuidv4();
  const { value, error } = productValidation(req.body);
  if (error) {
    logger.error(`product - create = ${error.details[0].message}`);
    return res.status(422).send({
      status: false,
      statusCode: 422,
      message: error.details[0].message,
    });
  }

  try {
    await addProductDB(value);
    logger.info('Add new product success');
    return res.status(201).send({
      status: true,
      statusCode: 201,
      message: 'Add product success',
    });
  } catch (error) {
    logger.error(`product - create = ${error}`);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;

  const { value, error } = updateProductValidation(req.body);
  if (error) {
    logger.error(`product - create = ${error.details[0].message}`);
    return res.status(422).send({
      status: false,
      statusCode: 422,
      message: error.details[0].message,
    });
  }

  const product = await getProductById(id);
  if (!product) {
    logger.info(`Product ${id} not found!`);
    return res.status(404).send({
      status: false,
      statusCode: 404,
      data: {},
    });
  }

  try {
    await updateProductDB(id, value);
    logger.info('Update product success');
    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: 'Update product success',
    });
  } catch (error) {}
};
