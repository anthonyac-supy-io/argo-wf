import { Expose, Type } from 'class-transformer';

import { Uom } from '../../common';
import { BulkUploadMetadata, IdPayload, SimpleUser } from './common.types';

export enum PackagingState {
  Active = 'active',
  Archived = 'archived',
  Deleted = 'deleted',
}
export enum PackagingSourceScopeEnum {
  Recipe = 'recipe',
  Item = 'item',
}
export class PackagingQuantityPayload {
  @Expose()
  readonly parent?: number;

  @Expose()
  readonly base?: number;

  @Expose()
  readonly baseUnit?: number;
}
export class PackagingSourcePayload extends IdPayload {
  @Expose()
  readonly scope: PackagingSourceScopeEnum;
}
export class PackagingPayload {
  @Expose()
  readonly level: 0 | 1 | 2;

  @Expose()
  readonly unitName?: string;

  @Expose()
  readonly fullPackageName?: string;

  @Expose()
  readonly packageName: string;

  @Expose()
  @Type(() => PackagingQuantityPayload)
  readonly quantity: PackagingQuantityPayload;

  @Expose()
  @Type(() => IdPayload)
  readonly retailer: IdPayload;

  @Expose()
  @Type(() => IdPayload)
  readonly parent?: IdPayload;

  @Expose()
  readonly usedAsPiece?: boolean;

  @Expose()
  @Type(() => Uom)
  readonly baseUnit?: Uom;

  @Expose()
  @Type(() => SimpleUser)
  readonly updatedBy: SimpleUser;

  @Expose()
  @Type(() => BulkUploadMetadata)
  metadata?: BulkUploadMetadata;
}

export class PackagingDataPayload extends PackagingPayload {
  @Expose()
  readonly id: string;

  @Expose()
  readonly fullPackageName: string;

  @Expose()
  @Type(() => PackagingSourcePayload)
  readonly sources: PackagingSourcePayload[];

  @Expose()
  readonly state: PackagingState;

  @Expose()
  @Type(() => Uom)
  readonly baseUnit: Uom;

  @Expose()
  @Type(() => IdPayload)
  readonly base?: IdPayload;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;

  @Expose()
  @Type(() => SimpleUser)
  readonly createdBy: SimpleUser;
}
