import { IQuery, IQueryResponse } from '@supy.api/query';

import { Supplier } from '../../../../common';

export type GetSuppliersPayload = IQuery<Supplier>;
export type GetSuppliersResponse = IQueryResponse<Supplier>;
