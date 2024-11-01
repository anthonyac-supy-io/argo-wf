import { Injectable } from '@nestjs/common';

import { ClientAdapter } from '@supy/common';

import { GetUserPayload, GetUserResponse } from './exchanges';

@Injectable()
export class UserAdapter {
  constructor(private readonly client: ClientAdapter) {}

  async getUserById(id: GetUserPayload): Promise<GetUserResponse> {
    return await this.client.core.sendAsync<
      GetUserResponse,
      GetUserPayload,
      'users.user.get'
    >('users.user.get', id);
  }
}
