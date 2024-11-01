import { Currency } from '@supy.api/dictionaries';
import { IQuery, IQueryResponse } from '@supy.api/query';

import {
  Brand,
  BrandRequest,
  Origin,
  OriginRequest,
  Uom,
} from '../../../../common';
import {
  BulkUploadMetadata,
  IdPayload,
  InvoiceUnit,
  LocalizedPayload,
  SupplierItemCreationSource,
  SupplierItemState,
} from '../../../../core';

export class CreateSupplierItemMetadataPayload extends BulkUploadMetadata {
  readonly supplierItemCode?: string;
  readonly currency?: Currency;
}

export class SupplierItemMetadataReply extends BulkUploadMetadata {
  readonly description?: string;
  readonly supplierItemCode?: string;
  readonly currency?: Currency;
  readonly isInStock?: boolean;
}
export interface CreateSupplierItemPayload {
  readonly name: LocalizedPayload;
  readonly uom: Uom;
  readonly invoiceUnit: InvoiceUnit;
  readonly supplierId?: string;
  readonly supplier: IdPayload;
  readonly origin?: OriginRequest;
  readonly brand?: BrandRequest;
  readonly metadata?: CreateSupplierItemMetadataPayload;
  readonly conversionFactor?: number;
  readonly classItemId?: string;
  readonly creationSource?: SupplierItemCreationSource;
  readonly 'metadata.bulkUpload.hash'?: string;
}
export interface CreateSupplierItemResponse {
  readonly id: string;
  readonly name: LocalizedPayload;
  readonly uom: Uom;
  readonly invoiceUnit: InvoiceUnit;
  readonly supplierId: string;
  readonly supplier: IdPayload;
  readonly origin?: Origin;
  readonly brand?: Brand;
  readonly creationSource?: SupplierItemCreationSource;
  readonly metadata?: SupplierItemMetadataReply;
  readonly state: SupplierItemState;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly 'metadata.bulkUpload.hash'?: string;
}

export type GetSupplierItemResponse =
  IQueryResponse<CreateSupplierItemResponse>;
export type GetSupplierItemPayload = IQuery<CreateSupplierItemResponse>;
