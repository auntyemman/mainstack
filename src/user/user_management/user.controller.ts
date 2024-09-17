import { Request, Response, NextFunction } from 'express';

import { UserService } from './user.service';
import { validateRequest } from '../../common/utils/request_validator';
import { SignUpDTO, SignInDTO, UpdateDTO, UserRole, CreateAdminDTO } from './user.dto';
import { AuthenticationService } from '../../user/authentication/authentication.service';
import { APIError } from '../../common/utils/custom_error';

export class UserController {
  private readonly userService;
  private readonly authService;
  constructor() {
    this.userService = new UserService();
    this.authService = new AuthenticationService();
  }

  async signUp(req: Request, res: Response, next: NextFunction): Promise<object | unknown> {
    try {
      const validated = await validateRequest(SignUpDTO, req.body);
      const user = await this.userService.createUser(validated);
      if (!user) {
        throw new APIError('Failed to create user');
      }
      const { id, email } = user;
      return res.status(201).json({
        status: 'success',
        message: `Registration successful`,
        data: {
          id: id,
          email: email,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async createAdmin(req: Request, res: Response, next: NextFunction): Promise<object | unknown> {
    try {
      const payload = { ...req.body, role: UserRole.admin };
      const validated = await validateRequest(CreateAdminDTO, payload);
      const user = await this.userService.createUser(validated);
      if (!user) {
        throw new APIError('Failed to create user');
      }
      const { id, email } = user;
      return res.status(201).json({
        status: 'success',
        message: `Admin creation successful`,
        data: {
          id: id,
          email: email,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<object | unknown> {
    try {
      const validated = await validateRequest(SignInDTO, req.body);
      const user = await this.userService.login(validated);
      const accessToken = this.authService.createAccessToken({ user: user });
      return res.status(200).json({
        status: 'success',
        message: 'Logged in successfully',
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction): Promise<object | unknown> {
    try {
      const id = req.params.id;
      const user = await this.userService.getUser(id);
      return res.status(200).json({
        status: 'success',
        message: 'User fetched successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<object | unknown> {
    const { _id } = res.locals.user.user;
    try {
      const user = await this.userService.getUser(_id);
      return res.status(200).json({
        status: 'success',
        message: 'profile in session fetched successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<object | unknown> {
    const { _id } = res.locals.user.user;
    try {
      const validated = await validateRequest(UpdateDTO, req.body);
      const updatedUser = await this.userService.updateUser(_id, validated);
      return res.status(200).json({
        status: 'success',
        message: 'user updated succesfully',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
}
