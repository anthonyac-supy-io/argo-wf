import { Injectable } from '@nestjs/common';

import { and, noLimit, query, where } from '@supy.api/query';
import { ClientAdapter } from '@supy/common';

import { Packaging } from '../../../common';
import { PackagingState } from '../../../core';
import {
  CreatePackagingPayload,
  CreatePackagingResponse,
  GetPackagingItemPayload,
  GetPackagingItemResponse,
} from './exchanges';

@Injectable()
export class PackagingItemAdapter {
  constructor(private readonly client: ClientAdapter) {}

  async createPackagingItem(
    payload: CreatePackagingPayload
  ): Promise<CreatePackagingResponse> {
    return await this.client.catalog.sendAsync<
      CreatePackagingResponse,
      CreatePackagingPayload & { metadata?: { shouldOmitEvent?: boolean } },
      'packaging-item.create.one'
    >('packaging-item.create.one', {
      ...payload,
      metadata: { ...payload.metadata, shouldOmitEvent: true },
    });
  }

  async getPackagingItemsByHash(hash: string): Promise<Packaging[]> {
    const { data } = await this.client.catalog.sendAsync<
      GetPackagingItemResponse,
      GetPackagingItemPayload,
      'packaging-item.get.many'
    >(
      'packaging-item.get.many',
      query(
        and(
          where('metadata.bulkUpload.hash', 'eq', hash),
          where('state', 'eq', PackagingState.Active)
        ),
        noLimit()
      )
    );

    return data;
  }
}
