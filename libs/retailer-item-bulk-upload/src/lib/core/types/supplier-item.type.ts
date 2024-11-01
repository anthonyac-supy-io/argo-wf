
import { IdPayload } from './common.types';

export enum SupplierItemState {
  Available = 'available',
  Deleted = 'deleted',
}
export enum InvoiceUnitType {
  Package = 'package',
  Uom = 'uom',
}
export enum SupplierItemCreationSource {
  Admin = 'admin',
  Supplier = 'supplier',
  Merged = 'merged',
  Generated = 'generated',
}
export interface InvoiceUnit {
  readonly name: string;
  readonly type: InvoiceUnitType;
  readonly conversionToAtom: number;
  readonly uom?: IdPayload;
  readonly packaging?: IdPayload;
}
