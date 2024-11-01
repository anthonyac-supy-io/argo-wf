import { faker } from '@faker-js/faker';

import { RetailerItemState, UomCategory, UomType } from '../../../common';
import { getRandomEnumValue } from '../../../common/utils';
import { CreateRetailerItemPayload, RetailerItemResponse, SetInventoryItemPayload, SetInventoryItemResponse } from './exchanges';

export const retailerItemAdapterMock = {
  createRetailerItem: jest.fn<
    RetailerItemResponse,
    [CreateRetailerItemPayload]
  >((payload) => ({
    ...{
      id: faker.string.uuid(),
      name: { en: faker.commerce.product() },
      code: faker.string.sample(5),
      baseUnit: {
        id: faker.string.uuid(),
        name: faker.string.alpha(8),
        type: getRandomEnumValue(UomType),
        category: getRandomEnumValue(UomCategory),
        conversionToAtom: faker.number.float(),
        isPiece: false,
      },
      state: getRandomEnumValue(RetailerItemState),
      retailer: {
        id: faker.string.uuid(),
        name: { en: faker.commerce.department() },
      },
      category: {
        id: faker.string.uuid(),
        name: { en: faker.commerce.product() },
      },
      accountingCategory: {
        id: faker.string.uuid(),
        name: faker.commerce.product(),
      },
      locations: Array(3).fill({ id: faker.string.uuid() }),
      suppliers: Array(3).fill({ id: faker.string.uuid() }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      createdBy: {
        id: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      },
      updatedBy: {
        id: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      },
      inventoryItem: { id: faker.string.uuid() },
    },
    ...payload,
  })),
  getRetailerItemByHash: jest.fn<RetailerItemResponse, [hash: string]>((payload) => {
    return undefined;
  }),
  setInventoryItem: jest.fn<SetInventoryItemResponse, [SetInventoryItemPayload]>(),
};
