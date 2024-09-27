import { User } from 'echadospalante-core';

export interface UserHttpService {
  getUserByEmail(email: string): Promise<User>;
}

export const UserHttpService = Symbol('UserHttpService');
