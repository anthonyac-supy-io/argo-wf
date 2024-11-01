import { Injectable } from '@nestjs/common';

import { and, noLimit, query, where } from '@supy.api/query';
import { ClientAdapter } from '@supy/common';

import { InventoryItem, ItemStateEnum } from '../../../common';
import {
  CreateInventoryItemPayload,
  CreateInventoryItemResponse,
  GetInventoryItemPayload,
  GetInventoryItemResponse,
} from './exchanges';

@Injectable()
export class InventoryItemAdapter {
  constructor(private readonly client: ClientAdapter) {}

  async createInventoryItem(
    payload: CreateInventoryItemPayload
  ): Promise<CreateInventoryItemResponse> {
    const { props: item } = await this.client.inventory.sendAsync<
      { props: CreateInventoryItemResponse },
      CreateInventoryItemPayload,
      'item.create.one'
    >('item.create.one', payload);

    return item;
  }

  async getInventoryItemsByHash(hash: string): Promise<InventoryItem[]> {
    const { data } = await this.client.inventory.sendAsync<
      GetInventoryItemResponse,
      GetInventoryItemPayload,
      'item.get.many'
    >(
      'item.get.many',
      query(
        and(
          where('metadata.bulkUpload.hash', 'eq', hash),
          where('state', 'eq', ItemStateEnum.Available)
        ),
        noLimit()
      )
    );

    return data;
  }
}
