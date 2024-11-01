import { Injectable } from '@nestjs/common';

import { and, noLimit, query, where } from '@supy.api/query';
import { ClientAdapter } from '@supy/common';

import { RetailerItemState } from '../../../common';
import {
  CreateRetailerItemPayload,
  GetRetailerItemPayload,
  GetRetailerItemResponse,
  RetailerItemResponse,
  SetInventoryItemPayload,
  SetInventoryItemResponse,
} from './exchanges';

@Injectable()
export class RetailerItemAdapter {
  constructor(private readonly client: ClientAdapter) {}

  async createRetailerItem(
    payload: CreateRetailerItemPayload
  ): Promise<RetailerItemResponse> {
    return await this.client.catalog.sendAsync<
      RetailerItemResponse,
      CreateRetailerItemPayload,
      'base-items.create.one'
    >('base-items.create.one', payload);
  }

  async getRetailerItemByHash(hash: string): Promise<RetailerItemResponse> {
    const { data } = await this.client.catalog.sendAsync<
      GetRetailerItemResponse,
      GetRetailerItemPayload,
      'base-items.get.many'
    >(
      'base-items.get.many',
      query(
        and(
          where('metadata.bulkUpload.hash', 'eq', hash),
          where('state', 'eq', RetailerItemState.Available)
        ),
        noLimit()
      ) as GetRetailerItemPayload
    );

    return data[0];
  }

  async setInventoryItem(
    payload: SetInventoryItemPayload
  ): Promise<SetInventoryItemResponse> {
    return await this.client.catalog.sendAsync<
      SetInventoryItemResponse,
      SetInventoryItemPayload,
      'base-items.update.one'
    >('base-items.update.one', payload);
  }
}
