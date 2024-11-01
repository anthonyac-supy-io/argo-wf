import { Injectable } from '@nestjs/common';

import { and, noLimit, query, where } from '@supy.api/query';
import { ClientAdapter } from '@supy/common';

import { Channel, ChannelState } from '../../../common';
import { GetChannelsPayload, GetChannelsResponse } from './exchanges';

@Injectable()
export class ChannelAdapter {
  constructor(private readonly client: ClientAdapter) {}

  async getChannelsByLocationIds(
    locationIds: string[]
  ): Promise<GetChannelsResponse> {
    return await this.client.core.sendAsync<
      GetChannelsResponse,
      GetChannelsPayload,
      'channels.get.many'
    >(
      'channels.get.many',
      query<Channel>(
        and(
          where('parties', 'contains-any', locationIds),
          where('state', 'eq', ChannelState.Active)
        ),
        noLimit()
      ) as GetChannelsPayload
    );
  }
}
