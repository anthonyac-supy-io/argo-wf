import { IQuery, IQueryResponse } from '@supy.api/query';

import { RetailerItemCategory } from '../../../../common';

export type GetRetailerItemCategoriesPayload = IQuery<RetailerItemCategory>;
export type GetRetailerItemCategoriesResponse =
  IQueryResponse<RetailerItemCategory>;
