import { Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { InvoiceUnit } from './supplier-item.type';

export class IdPayload {
  @Expose()
  readonly id: string;
}

export class LocalizedPayload {
  @Expose()
  readonly en: string;

  @Expose()
  readonly ar?: string;
}
export class SimpleEntity {
  @Expose()
  readonly id: string;

  @Expose()
  @Type(() => LocalizedPayload)
  readonly name: LocalizedPayload;
}

export class SimpleStringifiedEntity {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;
}

export class SimpleOptionalEntity extends IdPayload {
  @Expose()
  readonly name?: LocalizedPayload;
}

export class SimpleUser {
  @Expose()
  readonly id: string;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly phone?: string;

  @Expose()
  readonly email?: string;
}

export class GetSimpleUserResponse {
  @Expose()
  readonly id: string;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly photoUrl?: string;
}

export class DeprSimpleEntity extends IdPayload {
  @Expose()
  readonly name: string;
}
export class SupplierItemSnapshot {
  readonly id: string;
  readonly name?: LocalizedPayload;
  readonly invoiceUnit?: InvoiceUnit;
  readonly supplier?: string;
  readonly code?: string;
}

export class StringHash {
  @Expose()
  hash: string;
}
export class BulkUploadMetadata {
  @Expose()
  @IsOptional()
  bulkUpload?: StringHash;
}
