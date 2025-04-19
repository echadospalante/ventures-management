import { User } from 'echadospalante-core';

export interface UserHttpService {
  getUserById(userId: string): Promise<User>;
}

export const UserHttpService = Symbol('UserHttpService');
