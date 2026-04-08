import { Router } from 'express';
import { createOrderController, getAllOrdersController } from '../controllers/order.controller.js';

const orderRouter = Router();

orderRouter.get('/', getAllOrdersController);
orderRouter.post('/', createOrderController);

export default orderRouter;
