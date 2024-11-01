import { Injectable } from '@nestjs/common';

import { and, noLimit, query, where } from '@supy.api/query';
import { ClientAdapter } from '@supy/common';

import { ChannelItem, ChannelItemState } from '../../../common';
import {
  CreateChannelItemsPayload,
  CreateChannelItemsResponse,
  GetChannelItemsPayload,
  GetChannelItemsResponse,
} from './exchanges';

@Injectable()
export class ChannelItemAdapter {
  constructor(private readonly client: ClientAdapter) {}

  async createChannelItems(
    payload: CreateChannelItemsPayload
  ): Promise<CreateChannelItemsResponse> {
    return await this.client.catalog.sendAsync<
      CreateChannelItemsResponse,
      CreateChannelItemsPayload,
      'channel-items.create.many'
    >('channel-items.create.many', payload);
  }

  async getChannelItemsByHash(hash: string): Promise<GetChannelItemsResponse> {
    return await this.client.catalog.sendAsync<
      GetChannelItemsResponse,
      GetChannelItemsPayload,
      'channel-items.get.many'
    >(
      'channel-items.get.many',
      query<ChannelItem>(
        and(
          where('metadata.bulkUpload.hash', 'eq', hash),
          where('state', 'eq', ChannelItemState.Available)
        ),
        noLimit()
      )
    );
  }
}
