import { Injectable } from '@nestjs/common';

import { and, noLimit, query, where } from '@supy.api/query';
import { ClientAdapter } from '@supy/common';

import {
  RetailerItemCategory,
  RetailerItemCategoryState,
} from '../../../common';
import {
  GetRetailerItemCategoriesPayload,
  GetRetailerItemCategoriesResponse,
} from './exchanges';

@Injectable()
export class RetailerItemCategoryAdapter {
  constructor(private readonly client: ClientAdapter) {}

  async getRetailerItemCategoriesByRetailerId(
    retailerId: string
  ): Promise<GetRetailerItemCategoriesResponse> {
    return await this.client.catalog.sendAsync<
      GetRetailerItemCategoriesResponse,
      GetRetailerItemCategoriesPayload,
      'retailer-item-categories.get.many'
    >(
      'retailer-item-categories.get.many',
      query<RetailerItemCategory>(
        and(
          where('retailerId', 'eq', retailerId),
          where('state', 'eq', RetailerItemCategoryState.active)
        ),
        noLimit()
      )
    );
  }
}
