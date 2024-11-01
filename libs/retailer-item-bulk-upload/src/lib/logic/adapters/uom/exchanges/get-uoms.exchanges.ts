import { IQuery, IQueryResponse } from '@supy.api/query';

import { Uom } from '../../../../common';

export type GetUomsResponse = IQueryResponse<Uom>;
export type GetUomsPayload = IQuery<Uom>;
