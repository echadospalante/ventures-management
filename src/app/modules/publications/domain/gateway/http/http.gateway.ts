import { User } from 'echadospalante-domain';

export interface UserHttpService {
  getUserById(userId: string): Promise<User>;
}

export const UserHttpService = Symbol('UserHttpService');
