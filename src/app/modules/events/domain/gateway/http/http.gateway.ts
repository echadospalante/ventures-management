import { User, UserDetail } from 'echadospalante-core';

export interface UserHttpService {
  getUserById(userId: string): Promise<User>;
  getUserDetailById(userId: string): Promise<UserDetail>;
}

export const UserHttpService = Symbol('UserHttpService');
