import { faker } from '@faker-js/faker';

import { getSupplierId } from '../../../common/utils';
import { GetChannelsResponse } from './exchanges';

export const channelAdapterMock = {
  getChannelsByLocationIds: jest.fn<GetChannelsResponse, [string[]]>(
    (locationIds) => {
      const channels: GetChannelsResponse['data'] = [];
      locationIds.forEach((id, index) => {
        channels.push({
          ...{
            id: faker.string.uuid(),
            lastMessageIndex: faker.number.int(),
            lastOrderNumber: faker.number.int(),
            retailerId: id,
            supplierId: getSupplierId(index),
            parties: [getSupplierId(index), id],
            users: Array(3).fill(faker.string.uuid()),
          },
        });
      });

      return {
        data: channels,
        metadata: {
          count: channels.length,
          total: channels.length,
        },
      };
    }
  ),
};
