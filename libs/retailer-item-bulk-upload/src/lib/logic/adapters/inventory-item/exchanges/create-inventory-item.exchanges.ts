import { IQuery, IQueryResponse } from '@supy.api/query';

import {
  BulkUploadMetadata,
  IdPayload,
  LocalizedPayload,
  SimpleEntity,
  SimpleStringifiedEntity,
  SimpleUser,
} from '../../../..//core';
import {
  CostingMethod,
  CostingMethodEnum,
  InventoryItem,
  ItemLocation,
  ItemScopeTypeEnum,
  ItemStateEnum,
  RetailerItemSnapshot,
  Uom,
} from '../../../../common';

export interface CreateInventoryItemResponse {
  readonly id: string;
  readonly name: LocalizedPayload;
  readonly retailer: SimpleEntity;
  readonly retailerItem: RetailerItemSnapshot;
  readonly state: ItemStateEnum;
  readonly cost: number;
  readonly costingMethod: CostingMethod;
  readonly lastPurchaseCost?: number;
  readonly wastagePercentage?: number;
  readonly locations: ItemLocation[];
  readonly storages: SimpleEntity[];
  readonly notAffectCogs: boolean;
  readonly updatedBy: SimpleUser;
  readonly createdBy: SimpleUser;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly metadata?: BulkUploadMetadata;
}
export interface InventoryScopePayload {
  readonly type: ItemScopeTypeEnum;
  readonly referenceId?: string;
}

interface RetailerInventoryItemPayload extends SimpleEntity {
  readonly scope: InventoryScopePayload;
  readonly code: string;
  readonly category?: SimpleEntity;
  readonly suppliers?: IdPayload[];
  readonly baseUnit: Uom;
}

export interface CreateInventoryItemLocationPayload {
  readonly location: IdPayload;
}

export class CreateInventoryItemPayload {
  readonly retailer: SimpleStringifiedEntity;
  readonly retailerItem: RetailerInventoryItemPayload;
  readonly costingMethod: CostingMethodEnum;
  readonly fixedCost?: number;
  readonly wastagePercentage?: number;
  readonly locations: CreateInventoryItemLocationPayload[];
  readonly storages?: SimpleEntity[];
  readonly notAffectCogs: boolean;
  readonly createdBy: SimpleUser;
  readonly metadata?: BulkUploadMetadata;
}
export type GetInventoryItemResponse = IQueryResponse<InventoryItem>;
export type GetInventoryItemPayload = IQuery<InventoryItem>;
