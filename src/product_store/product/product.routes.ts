import { Router } from 'express';
import { ProductController } from './product.controller';
import { authUser } from '../../common/middlewares/auth';
import { adminRBAC } from '../../common/middlewares/admin.RBAC';
import { bindMethods } from '../../common/utils/bind_method';

export const product: Router = Router();
const productCont = bindMethods(new ProductController());

product.post('/create', authUser, adminRBAC, productCont.createProduct);
product.get('/:id', authUser, productCont.getProduct);
product.patch('/publish/:id', authUser, adminRBAC, productCont.publishProduct);
product.delete('/:id', authUser, adminRBAC, productCont.deleteProduct);
product.get('/list', authUser, productCont.getProducts);
product.put('/update/:id', authUser, adminRBAC, productCont.updateProduct);
