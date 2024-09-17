import { IUser } from './user.model';
import { hashPassword, comparePasswords } from '../../common/utils/password_hash';
import { UserRepository } from './user.repository';
import { APIError, BadRequestError, NotFoundError } from '../../common/utils/custom_error';

// User Service class for user management
export class UserService {
  private readonly userRepo;
  constructor() {
    this.userRepo = new UserRepository();
  }
  async createUser(data: IUser): Promise<IUser> {
    const user = await this.userRepo.findByEmail(data.email);
    if (user) {
      throw new BadRequestError('User already exists');
    }
    const hashedPassword = await hashPassword(data.password);
    data.password = hashedPassword;
    return await this.userRepo.create(data);
  }

  async login(data: IUser): Promise<IUser> {
    const { email, password } = data;
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundError('Not found');
    }
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestError('Password not match');
    }
    return user;
  }

  async getUser(userId: string): Promise<IUser> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError('user not found');
    }
    return user;
  }

  async updateUser(userId: string, user: Partial<IUser>): Promise<IUser> {
    const updatedUser = await this.userRepo.update(userId, user);
    if (!updatedUser) {
      throw new APIError('error updating user');
    }
    return updatedUser;
  }
}
