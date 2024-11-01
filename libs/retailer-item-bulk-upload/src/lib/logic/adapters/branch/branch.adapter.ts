import { Injectable } from '@nestjs/common';

import { and, noLimit, query, where } from '@supy.api/query';
import { ClientAdapter } from '@supy/common';

import { Branch, BranchState } from '../../../common';
import { GetBranchesPayload, GetBranchesResponse } from './exchanges';

@Injectable()
export class BranchAdapter {
  constructor(private readonly client: ClientAdapter) {}

  async getBranchesByRetailerId(
    retailerId: string
  ): Promise<GetBranchesResponse> {
    return await this.client.core.sendAsync<
      GetBranchesResponse,
      GetBranchesPayload,
      'branches.get.many'
    >(
      'branches.get.many',
      query<Branch>(
        and(
          where('retailer', 'eq', retailerId),
          where('state', 'eq', BranchState.active)
        ),
        noLimit()
      )
    );
  }
}
