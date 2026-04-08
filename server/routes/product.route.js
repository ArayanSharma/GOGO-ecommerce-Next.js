import { Router } from 'express';
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  uploadProductImageController,
} from '../controllers/product.controller.js';
import upload from '../config/multerConfig.js';

const productRouter = Router();

productRouter.get('/', getAllProductsController);
productRouter.get('/:id', getProductByIdController);
productRouter.post('/', createProductController);
productRouter.post('/uploadImage', upload.single('image'), uploadProductImageController);
productRouter.put('/:id', updateProductController);
productRouter.delete('/:id', deleteProductController);

export default productRouter;
