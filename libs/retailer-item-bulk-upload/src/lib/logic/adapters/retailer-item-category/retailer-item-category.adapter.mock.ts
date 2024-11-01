import { faker } from '@faker-js/faker';

import { RetailerItemCategoryState } from '../../../common';
import { getRandomEnumValue } from '../../../common/utils';
import { GetRetailerItemCategoriesResponse } from './exchanges';

export const retailerItemCategoryAdapterMock = {
  getRetailerItemCategoriesByRetailerId: jest.fn<
    GetRetailerItemCategoriesResponse,
    [retailerId: string]
  >((retailerId) => {
    const retailerItemCategories: GetRetailerItemCategoriesResponse['data'] =
      [];

    for (let i = 1; i <= 2; i++) {
      retailerItemCategories.push({
        ...{
          id: faker.string.uuid(),
          retailerId: faker.string.uuid(),
          name: { en: i < 2 ? 'Food' : 'Protein' },
          state: getRandomEnumValue(RetailerItemCategoryState),
          parent: i < 2 ? undefined : { id: retailerItemCategories[0].id },
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        },
        retailerId,
      });
    }

    return {
      data: retailerItemCategories,
      metadata: {
        total: retailerItemCategories.length,
        count: retailerItemCategories.length,
      },
    };
  }),
};
