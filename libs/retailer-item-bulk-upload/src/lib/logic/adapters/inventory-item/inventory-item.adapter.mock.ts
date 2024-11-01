import { faker } from '@faker-js/faker';

import {
  InventoryItem,
  ItemScopeTypeEnum,
  ItemStateEnum,
  UomCategory,
  UomType,
} from '../../../common';
import { getRandomEnumValue } from '../../../common/utils';
import {
  CreateInventoryItemPayload,
  CreateInventoryItemResponse,
} from './exchanges';

export const inventoryItemAdapterMock = {
  createInventoryItem: jest.fn<
    CreateInventoryItemResponse,
    [CreateInventoryItemPayload]
  >((payload) => ({
    ...{
      id: faker.string.uuid(),
      name: { en: faker.commerce.product() },
      retailer: {
        id: faker.string.uuid(),
        name: { en: faker.commerce.department() },
      },
      retailerItem: {
        id: faker.string.uuid(),
        name: { en: faker.commerce.product() },
        scope: {
          type: getRandomEnumValue(ItemScopeTypeEnum),
          referenceId: faker.string.uuid(),
        },
        code: faker.string.sample(),
        baseUnit: {
          id: faker.string.uuid(),
          name: faker.string.alpha(8),
          type: getRandomEnumValue(UomType),
          category: getRandomEnumValue(UomCategory),
          conversionToAtom: faker.number.float(),
          isPiece: false,
        },
      },
      state: ItemStateEnum.Available,
      cost: faker.number.float(),
      storages: Array(3).fill({
        id: faker.string.uuid(),
        name: { en: faker.commerce.product() },
      }),
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
    retailer: {
      ...payload.retailer,
      name: { en: payload.retailer.name },
    },
    costingMethod: {
      method: payload.costingMethod,
    },
    locations: payload.locations.map((location) => ({
      ...{
        location: {
          id: faker.string.uuid(),
          name: faker.commerce.department(),
          address: faker.location.secondaryAddress(),
          country: undefined,
          retailer: faker.string.uuid(),
          outlet: { id: faker.string.uuid() },
        },
        cost: faker.number.float(),
        quantity: faker.number.int(),
        packagingUnit: {
          name: faker.string.sample(),
          uomId: faker.string.uuid(),
          packagingId: faker.string.uuid(),
          toBaseUom: faker.number.float(),
          toAtomUom: faker.number.float(),
        },
        lastPurchaseCost: faker.number.int(),
      },
      id: location.location.id,
    })),
  })),
  getInventoryItemsByHash: jest.fn<InventoryItem[], [hash: string]>(
    (payload) => {
      return [];
    }
  ),
};
