import { faker } from '@faker-js/faker';

import {
  Packaging,
  PackagingQuantity,
  UomCategory,
  UomType,
} from '../../../common';
import { getRandomEnumValue } from '../../../common/utils';
import { PackagingSourceScopeEnum, PackagingState } from '../../../core';
import { CreatePackagingPayload, CreatePackagingResponse } from './exchanges';

export const packagingItemAdapterMock = {
  createPackagingItem: jest.fn<
    CreatePackagingResponse,
    [CreatePackagingPayload]
  >((payload) => ({
    ...{
      id: faker.string.uuid(),
      packageName: faker.commerce.product(),
      fullPackageName: faker.commerce.productName(),
      sources: Array(3).fill({
        id: faker.string.uuid(),
        scope: getRandomEnumValue(PackagingSourceScopeEnum),
      }),
      retailer: { id: faker.string.uuid() },
      // level: faker.number.int({ min: 0, max: 2 }),
      quantity: {
        base: faker.number.float(),
        baseUnit: 'kg',
        parent: faker.number.float(),
      },
      baseUnit: {
        id: faker.string.uuid(),
        name: faker.string.alpha(8),
        type: getRandomEnumValue(UomType),
        category: getRandomEnumValue(UomCategory),
        conversionToAtom: faker.number.float(),
        isPiece: false,
      },
      state: getRandomEnumValue(PackagingState),
      updatedBy: {
        id: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      },
      createdBy: {
        id: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      },
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    },
    ...payload,
  })),
  getPackagingItemsByHash: jest.fn<Packaging[], [hash: string]>((payload) => {
    return [];
  }),
};
