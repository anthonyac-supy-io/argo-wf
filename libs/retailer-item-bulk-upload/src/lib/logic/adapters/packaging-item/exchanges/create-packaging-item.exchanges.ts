import { Expose, Type } from 'class-transformer';

import { IQuery, IQueryResponse } from '@supy.api/query';

import {
  Packaging,
  PackagingQuantity,
  PackagingSource,
  Uom,
} from '../../../../common';
import {
  IdPayload,
  PackagingPayload,
  PackagingSourcePayload,
  PackagingState,
  SimpleUser,
} from '../../../../core';

export interface CreatePackagingResponse {
  readonly id: string;
  readonly unitName?: string;
  readonly packageName: string;
  readonly fullPackageName: string;
  readonly sources: PackagingSource[];
  readonly retailer: IdPayload;
  readonly level: 0 | 1 | 2;
  readonly quantity: PackagingQuantity;
  readonly parent?: IdPayload;
  readonly base?: IdPayload;
  readonly usedAsPiece?: boolean;
  readonly baseUnit: Uom;
  readonly state: PackagingState;
  readonly updatedBy: SimpleUser;
  readonly createdBy: SimpleUser;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
export class CreatePackagingPayload extends PackagingPayload {
  @Expose()
  @Type(() => PackagingSourcePayload)
  readonly source: PackagingSourcePayload;

  @Expose()
  @Type(() => SimpleUser)
  readonly createdBy: SimpleUser;
}
export type GetPackagingItemResponse = IQueryResponse<Packaging>;
export type GetPackagingItemPayload = IQuery<Packaging>;
