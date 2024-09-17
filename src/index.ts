import { Router } from 'express';
import { user } from './user/user_management/user.routes';
import { product } from './product_store/product/product.routes';
import { inventory } from './product_store/inventory/inventory.routes';

export const router: Router = Router();

// each route
router.use('/', user);
router.use('/products', product);
router.use('/inventories', inventory);
