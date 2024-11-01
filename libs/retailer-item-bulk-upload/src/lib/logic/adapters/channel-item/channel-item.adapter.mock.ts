import { faker } from '@faker-js/faker';

import { ChannelItemState, UomCategory, UomType } from '../../../common';
import { getRandomEnumValue } from '../../../common/utils';
import {
  CreateChannelItemsPayload,
  CreateChannelItemsResponse,
  GetChannelItemsResponse,
} from './exchanges';

export const channelItemAdapterMock = {
  createChannelItems: jest.fn<
    CreateChannelItemsResponse,
    [CreateChannelItemsPayload]
  >((payload) => {
    const channelItems: CreateChannelItemsResponse['items'] = [];
    payload.items.forEach((item) => {
      channelItems.push({
        ...{
          id: faker.string.uuid(),
          name: { en: faker.commerce.product() },
          uom: {
            id: faker.string.uuid(),
            name: faker.string.alpha(8),
            type: getRandomEnumValue(UomType),
            category: getRandomEnumValue(UomCategory),
            conversionToAtom: faker.number.float(),
            isPiece: false,
          },
          price: faker.number.float(),
          itemCode: faker.string.sample(),
          retailer: { id: faker.string.uuid() },
          branch: { id: faker.string.uuid() },
          channel: { id: faker.string.uuid() },
          supplier: { id: faker.string.uuid() },
          retailerItem: { id: faker.string.uuid() },
          supplierItem: { id: faker.string.uuid() },
          state: getRandomEnumValue(ChannelItemState),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        },
        ...item,
      });
    });

    return {
      items: channelItems,
    };
  }),
  getChannelItemsByHash: jest.fn<GetChannelItemsResponse, [hash: string]>(
    (payload) => {
      return { data: [], metadata: { count: 0, total: 0 } };
    }
  ),
};
