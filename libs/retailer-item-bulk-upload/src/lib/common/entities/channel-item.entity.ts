import {
  BulkUploadMetadata,
  IdPayload,
  LocalizedPayload,
  PackagingDataPayload,
  SimpleEntity,
  SupplierItemSnapshot,
} from '../../core';
import { PreferredType } from './channel.entity';
import { Uom } from './uom.entity';

export enum ChannelItemState {
  Available = 'available',
  Deleted = 'deleted',
}
export enum ComplianceStatusEnum {
  InAudit = 'in-audit',
  Unchecked = 'unchecked',
  Compliant = 'compliant',
}
export enum LinkStatusEnum {
  Verified = 'verified',
  Linked = 'linked',
  Suspicious = 'suspicious',
  Unlinked = 'unlinked',
}
export interface ItemMergingRawProps {
  mainId?: string;
  secondaryId?: string;
  mergeDate: Date;
}
export interface ChannelItemLocationRawProps {
  id: string;
  lastOpeningStockCountDate?: Date;
}
export interface ChannelItem {
  readonly id: string;
  readonly merging?: ItemMergingRawProps;
  readonly state: ChannelItemState;
  readonly retailer: IdPayload;
  readonly branch: IdPayload;
  readonly location: ChannelItemLocationRawProps;
  readonly category: SimpleEntity;
  readonly complianceStatus?: ComplianceStatusEnum;
  readonly inventoryItem?: string;
  readonly itemCode?: string;
  readonly linkStatus?: LinkStatusEnum;
  readonly name: LocalizedPayload;
  readonly packaging?: PackagingDataPayload;
  readonly preferredType?: PreferredType;
  readonly price: number;
  readonly favoredBy?: string[];
  readonly priority?: boolean;
  readonly retailerItem?: SimpleEntity;
  readonly channel: IdPayload;
  readonly supplier: IdPayload;
  readonly supplierItem?: SupplierItemSnapshot;
  readonly uom?: Uom;
  readonly metadata?: BulkUploadMetadata;
  readonly 'metadata.bulkUpload.hash'?: string;
}
