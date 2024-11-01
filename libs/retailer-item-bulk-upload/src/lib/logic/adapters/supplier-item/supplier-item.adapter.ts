import { Injectable } from '@nestjs/common';

import { and, noLimit, query, where } from '@supy.api/query';
import { ClientAdapter } from '@supy/common';

import { SupplierItemState } from '../../../core';
import {
  CreateSupplierItemPayload,
  CreateSupplierItemResponse,
  GetSupplierItemPayload,
  GetSupplierItemResponse,
} from './exchanges';

@Injectable()
export class SupplierItemAdapter {
  constructor(private readonly client: ClientAdapter) {}

  async createSupplierItem(
    payload: CreateSupplierItemPayload
  ): Promise<CreateSupplierItemResponse> {
    return await this.client.catalog.sendAsync<
      CreateSupplierItemResponse,
      CreateSupplierItemPayload,
      'supplier-items.create.one'
    >('supplier-items.create.one', payload);
  }

  async getSupplierItemsByHash(
    hash: string
  ): Promise<GetSupplierItemResponse['data']> {
    const { data } = await this.client.catalog.sendAsync<
      GetSupplierItemResponse,
      GetSupplierItemPayload,
      'supplier-items.get.many'
    >(
      'supplier-items.get.many',
      query(
        and(
          where('metadata.bulkUpload.hash', 'eq', hash),
          where('state', 'eq', SupplierItemState.Available)
        ),
        noLimit()
      ) as GetSupplierItemPayload
    );

    return data;
  }
}
