import { Injectable } from '@nestjs/common';

import { ClientAdapter } from '@supy/common';

import { GetRetailerPayload, GetRetailerResponse } from './exchanges';

@Injectable()
export class RetailerAdapter {
  constructor(private readonly client: ClientAdapter) {}

  async getRetailerById(id: GetRetailerPayload): Promise<GetRetailerResponse> {
    return await this.client.core.sendAsync<
      GetRetailerResponse,
      GetRetailerPayload,
      'retailers.get.one'
    >('retailers.get.one', id);
  }
}
