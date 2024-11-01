import { faker } from '@faker-js/faker';

import { UomType } from '../../../common';
import { getRandomEnumValue } from '../../../common/utils';
import { InvoiceUnitType, SupplierItemState } from '../../../core';
import {
  CreateSupplierItemPayload,
  CreateSupplierItemResponse,
} from './exchanges';

export const supplierItemAdapterMock = {
  createSupplierItem: jest.fn<
    CreateSupplierItemResponse,
    [CreateSupplierItemPayload]
  >((payload) => {
    return {
      ...{
        id: faker.string.uuid(),
        name: { en: faker.commerce.product() },
        uom: {
          id: faker.string.uuid(),
          name: faker.string.alpha(8),
          type: getRandomEnumValue(UomType),
          category: faker.string.alpha(5),
          conversionToAtom: faker.number.float(),
          isPiece: false,
        },
        invoiceUnit: {
          name: faker.string.alpha(8),
          type: getRandomEnumValue(InvoiceUnitType),
          conversionToAtom: faker.number.float(),
        },
        supplierId: faker.string.uuid(),
        supplier: { id: faker.string.uuid() },
        state: getRandomEnumValue(SupplierItemState),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      },
      ...payload,
    };
  }),
  getSupplierItemsByHash: jest.fn<CreateSupplierItemResponse[], [hash: string]>(
    (payload) => {
      return [];
    }
  ),
};
