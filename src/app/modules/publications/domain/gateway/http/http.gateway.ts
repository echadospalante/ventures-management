import { User } from 'echadospalante-domain';

export interface UserHttpService {
  getUserById(userId: string): Promise<User>;
  getUserByEmail(userId: string): Promise<User>;
  getRandomUser(): Promise<User | null>;
}

export const UserHttpService = Symbol('UserHttpService');
