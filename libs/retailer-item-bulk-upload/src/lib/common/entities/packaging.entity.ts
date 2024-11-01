import { BulkUploadMetadata, IdPayload, SimpleUser } from '../../core';
import {
  PackagingSourceScopeEnum,
  PackagingState,
} from '../../core/types/packaging.type';
import { Uom } from './uom.entity';

export interface PackagingSource {
  readonly scope: PackagingSourceScopeEnum;
  readonly id: string;
}
export interface PackagingQuantity {
  readonly parent?: number;
  readonly base?: number;
  readonly baseUnit?: number;
}
export interface Packaging {
  id: string;
  unitName?: string;
  packageName: string;
  fullPackageName: string;
  sources: PackagingSource[];
  readonly retailer: IdPayload;
  level: 0 | 1 | 2;
  quantity: PackagingQuantity;
  parent?: IdPayload;
  base?: IdPayload;
  usedAsPiece?: boolean;
  baseUnit: Uom;
  state: PackagingState;
  updatedBy: SimpleUser;
  createdBy: SimpleUser;
  createdAt: Date;
  updatedAt: Date;
  metadata?: BulkUploadMetadata;

  /** @internal */
  readonly 'parent.id': string;
  /** @internal */
  readonly 'base.id': string;
  /** @internal */
  readonly 'sources.id': string;
  /** @internal */
  readonly 'retailer.id': string;
  /** @internal */
  readonly 'baseUnit.id': string;
  /** @internal */
  readonly 'baseUnit.name': string;
  /** @internal */
  readonly 'updatedBy.id': string;
  /** @internal */
  readonly 'createdBy.id': string;
  /** @internal */
  readonly 'metadata.bulkUpload.hash': string;
}
