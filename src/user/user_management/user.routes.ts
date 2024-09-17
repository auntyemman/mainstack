import { Router } from 'express';
import { UserController } from './user.controller';
import { authUser } from '../../common/middlewares/auth';
import { bindMethods } from '../../common/utils/bind_method';

export const user: Router = Router();
const userCont = bindMethods(new UserController());

user.post('/auth/signup', userCont.signUp);
user.post('/auth/admin', userCont.createAdmin);
user.post('/auth/login', userCont.login);
user.get('/users/profile', authUser, userCont.getProfile);
user.get('/users/:id', authUser, userCont.getUser);
user.put('/users/profile', authUser, userCont.updateProfile);
