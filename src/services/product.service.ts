import { logger } from '../utils/logger';
import productModel from '../models/product.model';
import ProductType from '../types/product.type';

export const getProductDB = async () => {
  return await productModel
    .find()
    .then((data) => {
      return data;
    })
    .catch((error) => logger.error(`Cannot get data from DB error: ${error}`));
};

export const addProductDB = async (payload: ProductType) => {
  return await productModel.create(payload);
};

export const getProductById = async (id: string) => {
  return await productModel.findOne({ product_id: id });
};

export const updateProductDB = async (id: string, payload: ProductType) => {
  return await productModel.findOneAndUpdate(
    { product_id: id },
    { $set: payload }
  );
};
