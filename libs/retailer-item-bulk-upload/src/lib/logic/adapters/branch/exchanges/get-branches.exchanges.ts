import { IQuery, IQueryResponse } from '@supy.api/query';

import { Branch } from '../../../../common';

export type GetBranchesResponse = IQueryResponse<Branch>;
export type GetBranchesPayload = IQuery<Branch>;
