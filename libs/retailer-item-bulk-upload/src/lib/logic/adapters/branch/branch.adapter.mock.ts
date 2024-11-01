import { faker } from '@faker-js/faker';

import { BranchState } from '../../../common';
import { getRandomEnumValue } from '../../../common/utils';
import { GetBranchesResponse } from './exchanges';

export const branchAdapterMock = {
  getBranchesByRetailerId: jest.fn<GetBranchesResponse, [string]>(
    (retailerId) => {
      const branches: GetBranchesResponse['data'] = Array(3).fill({
        ...{
          id: faker.string.uuid(),
          name: faker.commerce.department(),
          state: getRandomEnumValue(BranchState),
          outlet: {
            id: faker.string.uuid(),
            name: { en: faker.commerce.department() },
          },
          users: Array(3).fill({
            id: faker.string.uuid(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
          }),
          retailer: retailerId,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        },
        retailer: retailerId,
      });

      return {
        data: branches,
        metadata: {
          count: branches.length,
          total: branches.length,
        },
      };
    }
  ),
};
