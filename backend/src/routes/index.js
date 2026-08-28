import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  loginController,
  passwordController,
  registerController,
} from '../controllers/auth.controller.js';
import {
  dashboardController,
  getUserController,
  listStoresController,
  listUsersController,
  createUserController,
  updateUserController,
  deleteUserController,
  ownerDashboardController,
} from '../controllers/admin.controller.js';
import { postRating, putRating } from '../controllers/rating.controller.js';
import {
  createStoreController,
  storeController,
  storesController,
} from '../controllers/store.controller.js';

const router = Router();

router.post('/auth/register', registerController);
router.post('/auth/login', loginController);
router.patch('/auth/password', authenticate, passwordController);

router.get('/stores', authenticate, authorize('user'), storesController);
router.get('/stores/:id', authenticate, authorize('user'), storeController);

router.post('/ratings', authenticate, authorize('user'), postRating);
router.put('/ratings/:id', authenticate, authorize('user'), putRating);

router.get('/admin/dashboard', authenticate, authorize('admin'), dashboardController);
router.get('/admin/users', authenticate, authorize('admin'), listUsersController);
router.get('/admin/users/:id', authenticate, authorize('admin'), getUserController);
router.post('/admin/users', authenticate, authorize('admin'), createUserController);
router.put('/admin/users/:id', authenticate, authorize('admin'), updateUserController);
router.delete('/admin/users/:id', authenticate, authorize('admin'), deleteUserController);
router.get('/admin/stores', authenticate, authorize('admin'), listStoresController);
router.post('/admin/stores', authenticate, authorize('admin'), createStoreController);

router.get('/store-owner/dashboard', authenticate, authorize('owner'), ownerDashboardController);

export default router;
