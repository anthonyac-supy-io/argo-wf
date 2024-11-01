import { Branch, Supplier, Uom } from '../../common';
import {
  IdPayload,
  LocalizedPayload,
  SimpleEntity,
  SimpleUser,
} from '../../core';
import { CreateRetailerItemPayload, GetChannelResponse } from '../adapters';

export interface PackagingSupplierInput {
  readonly itemName: LocalizedPayload;
  readonly itemCode?: string;
  readonly invoiceUnit: string;
  readonly price: number;
  readonly supplierName: string;
  readonly isPriority: boolean;
}

export interface PackagingInput {
  readonly unitName?: string;
  readonly quantity: number;
  readonly suppliers?: PackagingSupplierInput[];
}

export interface PackagingWithChildrenInput extends PackagingInput {
  readonly usedAsPiece?: boolean;
  readonly children?: PackagingWithChildrenInput[];
}

export interface RetailerItemCategoryInput {
  readonly parentName: string;
  readonly childName: string;
}

export interface RetailerItemInput {
  readonly name: LocalizedPayload;
  readonly category?: RetailerItemCategoryInput;
  readonly baseUnit: string;
  readonly code: string;
  readonly costCenter?: string;
  readonly packagingOptions: PackagingWithChildrenInput[];
}

export interface UploadSingleEntityInput {
  readonly retailer: IdPayload;
  readonly item: RetailerItemInput;
}
export interface UploadEntitiesInput {
  readonly retailer: IdPayload;
  readonly items: RetailerItemInput[];
}
export interface SingleEntity {
  readonly locations: Branch[];
  readonly userInstance: SimpleUser;
  readonly retailerInstance: SimpleEntity;
  readonly baseUnit: Uom;
  readonly suppliers: Supplier[];
  readonly possibleIntegratedSupplierUnitsMap: Record<string, string[]>;
  readonly allRetailerChannels: GetChannelResponse[];
  readonly createRetailerItemPayload: CreateRetailerItemPayload;
  readonly packagingOptions: PackagingWithChildrenInput[];
}
