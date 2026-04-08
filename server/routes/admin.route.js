import { Router } from 'express';
import {
  adminChangePasswordController,
  adminLoginController,
  adminLogoutController,
  adminProfileController,
} from '../controllers/admin.controller.js';
import adminAuth from '../middleware/adminAuth.js';

const adminRouter = Router();

adminRouter.post('/login', adminLoginController);
adminRouter.get('/logout', adminLogoutController);
adminRouter.get('/me', adminAuth, adminProfileController);
adminRouter.post('/change-password', adminAuth, adminChangePasswordController);

export default adminRouter;
