import { faker } from '@faker-js/faker';

import { RetailerState } from '../../../common';
import { getRandomEnumValue } from '../../../common/utils';
import { GetRetailerPayload, GetRetailerResponse } from './exchanges';

export const retailerAdapterMock = {
  getRetailerById: jest.fn<GetRetailerResponse, [GetRetailerPayload]>((id) => ({
    ...{
      id: faker.string.uuid(),
      name: faker.commerce.department(),
      state: getRandomEnumValue(RetailerState),
      metadata: { color: undefined },
      branches: faker.number.int(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    },
    ...id,
  })),
};
