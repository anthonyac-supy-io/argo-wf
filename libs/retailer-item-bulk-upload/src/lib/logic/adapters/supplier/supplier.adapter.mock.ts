import { faker } from '@faker-js/faker';

import {
  IntegratedUnitTypeEnum,
  Supplier,
  SupplierPartnershipTypeEnum,
  SupplierState,
  SupplierType,
} from '../../../common';
import { getRandomEnumValue, getSupplierId } from '../../../common/utils';
import { GetSuppliersResponse } from './exchanges';

export const supplierAdapterMock = {
  getSuppliersByName: jest.fn<GetSuppliersResponse, [supplierNames: string[]]>(
    (supplierNames) => {
      const suppliers: GetSuppliersResponse['data'] = [];
      supplierNames.forEach((supplierName, index) => {
        suppliers.push({
          ...{
            id: getSupplierId(index),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            address: faker.location.streetAddress(),
            users: Array(3).fill({
              id: faker.string.uuid(),
              firstName: faker.person.firstName(),
              lastName: faker.person.lastName(),
            }),
            type: getRandomEnumValue(SupplierType),
            state: getRandomEnumValue(SupplierState),
            createdAt: faker.date.past(),
            updatedAt: faker.date.past(),
          },
          name: supplierName,
        });
      });
      suppliers.push({
        id: getSupplierId(suppliers.length),
        name: 'INTEGRATED SUPPLIER',
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        users: Array(3).fill({
          id: faker.string.uuid(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
        }),
        type: getRandomEnumValue(SupplierType),
        state: getRandomEnumValue(SupplierState),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        metadata: {
          partnershipType: SupplierPartnershipTypeEnum.Integrated,
          integratedUnits: [
            {
              id: faker.string.uuid(),
              name: 'Kg',
              scope: getRandomEnumValue(IntegratedUnitTypeEnum),
            },
            {
              id: faker.string.uuid(),
              name: 'L',
              scope: getRandomEnumValue(IntegratedUnitTypeEnum),
            },
            {
              id: faker.string.uuid(),
              name: 'Piece',
              scope: getRandomEnumValue(IntegratedUnitTypeEnum),
            },
          ],
        },
      });

      return {
        data: suppliers,
        metadata: {
          total: supplierNames.length,
          count: supplierNames.length,
        },
      };
    }
  ),
};
