import { User } from 'echadospalante-domain';

export interface UserHttpService {
  getUserByEmail(email: string): Promise<User>;
  getUserById(id: string): Promise<User>;
  getRandomUser(): Promise<User | null>;
}

export const UserHttpService = Symbol('UserHttpService');
