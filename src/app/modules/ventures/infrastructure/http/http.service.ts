import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { User, UserDetail } from 'echadospalante-core';

import { HttpService } from '../../../../config/http/axios.config';
import { UserHttpService } from '../../domain/gateway/http/http.gateway';

@Injectable()
export class UserHttpAdapter implements UserHttpService {
  private readonly BASE_USERS_URL: string;
  public constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.BASE_USERS_URL = this.configService.getOrThrow('BASE_USERS_URL');
  }

  public getUserById(userId: string): Promise<User> {
    return this.httpService.get<User>(
      `${this.BASE_USERS_URL}/api/v1/users/${userId}`,
    );
  }

  public getUserDetailById(userId: string): Promise<UserDetail> {
    return this.httpService.get<UserDetail>(
      `${this.BASE_USERS_URL}/api/v1/users/${userId}/detail`,
    );
  }
}
