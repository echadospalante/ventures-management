import { User } from 'echadospalante-domain';

export interface UserHttpService {
  getUserByEmail(email: string): Promise<User>;
  getUserById(id: string): Promise<User>;
}

export const UserHttpService = Symbol('UserHttpService');
