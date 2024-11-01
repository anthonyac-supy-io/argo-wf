import {
  BulkUploadMetadata,
  IdPayload,
  LocalizedPayload,
  SimpleEntity,
  SimpleUser,
} from '../../core';
import { Uom } from './uom.entity';

export enum ItemScopeTypeEnum {
  Finished = 'finished',
  SemiFinished = 'semi-finished',
  SubRecipe = 'sub-recipe',
  Item = 'item',
}

export enum RetailerItemState {
  Available = 'available',
  Draft = 'draft',
  Archived = 'archived',
}

export interface ItemScope {
  type: ItemScopeTypeEnum;
  referenceId?: string;
}
export interface RetailerItem {
  readonly id: string;
  readonly name: LocalizedPayload;
  readonly code: string;
  readonly baseUnit: Uom;
  readonly scope?: ItemScope;
  readonly state: RetailerItemState;
  readonly retailer: SimpleEntity;
  readonly category?: SimpleEntity;
  readonly accountingCategory?: SimpleEntity;
  readonly locations: IdPayload[];
  readonly suppliers?: IdPayload[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdBy: SimpleUser;
  readonly updatedBy: SimpleUser;
  readonly inventoryItem: IdPayload;
  readonly metadata?: BulkUploadMetadata;
  /**
   * @internal
   */
  readonly 'suppliers.id': string;
  /**
   * @internal
   */
  readonly 'category.id': string;
  /**
   * @internal
   */
  readonly 'createdBy.id': string;
  /**
   * @internal
   */
  readonly 'updatedBy.id': string;
  /**
   * @internal
   */
  readonly 'name.en': string;
  /**
   * @internal
   */
  readonly 'name.ar': string;
  /**
   * @internal
   */
  readonly 'retailer.id': string;
  /**
   * @internal
   */
  readonly 'locations.id': string;
  /**
   * @internal
   */
  readonly 'baseUnit.conversionToAtom': string;
  /**
   * @internal
   */
  readonly 'baseUnit.type': string;
  /**
   * @internal
   */
  readonly 'scope.referenceId': string;
  /**
   * @internal
   */
  readonly 'accountingCategory.id': string;
  /**
   * @internal
   */
  readonly 'inventoryItem.id': string;
  /**
   * @internal
   */
  readonly 'scope.type': string;
  /**
   * @internal
   */
  readonly 'metadata.bulkUpload.hash': string;
}
enum RetailerItemsProps {
  id = 'id',
  code = 'code',
  'createdAt' = 'createdAt',
  'createdBy.id' = 'createdBy.id',
  'updatedBy.id' = 'updatedBy.id',
  'name.en' = 'name.en',
  'name.ar' = 'name.ar',
  'baseUnit.conversionToAtom' = 'baseUnit.conversionToAtom',
  'baseUnit.type' = 'baseUnit.type',
  'retailer.id' = 'retailer.id',
  'locations.id' = 'locations.id',
  'category.id' = 'category.id',
  'suppliers.id' = 'suppliers.id',
  'scope.referenceId' = 'scope.referenceId',
  'state' = 'state',
  'accountingCategory.id' = 'accountingCategory.id',
  'inventoryItem.id' = 'inventoryItem.id',
  'scope.type' = 'scope.type',
  'metadata.bulkUpload.hash' = 'metadata.bulkUpload.hash',
}

export type RetailerItemsKeys = typeof RetailerItemsProps;
export interface RetailerItemSnapshot extends SimpleEntity {
  scope: ItemScope;
  code: string;
  category?: SimpleEntity;
  baseUnit: Uom;
}
