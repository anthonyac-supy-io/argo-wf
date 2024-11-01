import { Expose, Type } from 'class-transformer';

import { IQuery, IQueryResponse } from '@supy.api/query';

import {
  ItemScope,
  ItemScopeTypeEnum,
  RetailerItemState,
  Uom,
} from '../../../../common';
import {
  BulkUploadMetadata,
  DeprSimpleEntity,
  IdPayload,
  LocalizedPayload,
  SimpleEntity,
  SimpleUser,
} from '../../../../core';

export class ScopePayload {
  @Expose()
  readonly type: ItemScopeTypeEnum;

  @Expose()
  readonly referenceId?: string;
}

export class RetailerItemMetadataPayload extends BulkUploadMetadata {
  @Expose()
  readonly hasChannelItemsOnCreation?: boolean;

  @Expose()
  readonly source?: string;
}

export class RetailerItemPayload {
  @Expose()
  @Type(() => LocalizedPayload)
  readonly name: LocalizedPayload;

  @Expose()
  @Type(() => ScopePayload)
  readonly scope?: ScopePayload;

  @Expose()
  readonly code: string;

  @Expose()
  @Type(() => SimpleEntity)
  readonly retailer: SimpleEntity;

  @Expose()
  @Type(() => SimpleEntity)
  readonly category?: SimpleEntity;

  @Expose()
  @Type(() => RetailerItemMetadataPayload)
  readonly metadata?: RetailerItemMetadataPayload;

  @Expose()
  @Type(() => DeprSimpleEntity)
  readonly accountingCategory?: DeprSimpleEntity;

  @Expose()
  @Type(() => IdPayload)
  readonly locations: IdPayload[];

  @Expose()
  @Type(() => IdPayload)
  readonly suppliers?: IdPayload[];
}

export class CreateRetailerItemPayload extends RetailerItemPayload {
  @Expose()
  @Type(() => SimpleUser)
  readonly createdBy: SimpleUser;

  @Expose()
  @Type(() => SimpleUser)
  readonly updatedBy: SimpleUser;
}

export interface RetailerItemResponse {
  readonly id: string;
  readonly name: LocalizedPayload;
  readonly code: string;
  readonly baseUnit: Uom;
  readonly scope?: ItemScope;
  readonly state: RetailerItemState;
  readonly retailer: SimpleEntity;
  readonly category?: SimpleEntity;
  readonly accountingCategory?: DeprSimpleEntity;
  readonly locations: IdPayload[];
  readonly suppliers?: IdPayload[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdBy: SimpleUser;
  readonly updatedBy: SimpleUser;
  readonly inventoryItem?: IdPayload;
  readonly metadata?: BulkUploadMetadata;
}

export interface RetailerItemQuery {
  readonly id: string;
  readonly code: string;
  readonly state: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly 'suppliers.id'?: string;
  readonly 'category.id'?: string;
  readonly 'createdBy.id'?: string;
  readonly 'updatedBy.id'?: string;
  readonly 'name.en'?: string;
  readonly 'name.ar'?: string;
  readonly 'retailer.id'?: string;
  readonly 'locations.id'?: string;
  readonly 'scope.referenceId'?: string;
  readonly 'scope.type'?: ItemScopeTypeEnum;
  readonly 'inventoryItem.id'?: string;
  readonly 'baseUnit.conversionToAtom': number;
  readonly 'baseUnit.type': string;
  readonly 'accountingCategory.id'?: string;
  readonly 'metadata.bulkUpload.hash'?: string;
}
export type GetRetailerItemResponse = IQueryResponse<RetailerItemResponse>;
export type GetRetailerItemPayload = IQuery<RetailerItemQuery>;

export class SetInventoryItemPayload {
  @Expose()
  id: string;

  @Expose()
  @Type(() => IdPayload)
  inventoryItem: IdPayload;

  @Expose()
  @Type(() => SimpleUser)
  updatedBy: SimpleUser;
}
export type SetInventoryItemResponse = void;
