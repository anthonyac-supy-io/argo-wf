import {
  BulkUploadMetadata,
  LocalizedPayload,
  SimpleEntity,
  SimpleUser,
} from '../../core';
import { LocationSnapshot } from './branch.entity';
import { RetailerItemSnapshot } from './retailer-item.entity';

export enum CostingMethodEnum {
  PurchaseOrder = 'purchase-order',
  Fixed = 'fixed',
}

export enum ItemStateEnum {
  Available = 'available',
  Archived = 'archived',
  Deleted = 'deleted',
}

export interface CostingMethod {
  readonly method: CostingMethodEnum;
  readonly fixedCost?: number;
}
export interface LastStockCountMetadata {
  readonly onHandQuantity: number;
  readonly countedQuantity: number;
  readonly eventDate: Date;
}
export interface StockCountMetadata {
  readonly lastStockCount?: LastStockCountMetadata;
}
export interface PackagingUnit {
  readonly name: string;
  readonly uomId: string;
  readonly packagingId?: string;
  readonly toBaseUom: number;
  readonly toAtomUom: number;
  readonly isPiece?: boolean;
  readonly isPreferred?: boolean;
}

export interface QuantityLevel {
  readonly min: number;
  readonly par: number;
}
export interface ItemLocation {
  readonly id: string;
  readonly location: LocationSnapshot;
  readonly cost: number;
  readonly quantity: number;
  readonly packagingUnit: PackagingUnit;
  readonly quantityLevel?: QuantityLevel;
  readonly lastPurchaseCost: number;
  readonly metadata?: StockCountMetadata;
}
export interface InventoryItem {
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

  'retailer.id'?: string;
  'storages.id'?: string;
  isStockable?: boolean;
  'locations.id'?: string;
  'name.en'?: string;
  'name.ar'?: string;
  type?: string;
  'costingMethod.method'?: string;
  'retailerItem.name.en'?: string;
  'retailerItem.name.ar'?: string;
  'retailerItem.id'?: string;
  'retailerItem.code'?: string;
  'retailerItem.scope.referenceId'?: string;
  'retailerItem.scope.type'?: string;
  'retailerItem.baseUnit.type'?: string;
  'retailerItem.category.id'?: string;
  'metadata.bulkUpload.hash'?: string;
}
