import { IQuery, IQueryResponse } from '@supy.api/query';

import {
  ChannelItem,
  ChannelItemState,
  PreferredType,
  Uom,
} from '../../../../common';
import {
  BulkUploadMetadata,
  IdPayload,
  LocalizedPayload,
  PackagingDataPayload,
} from '../../../../core';

export interface SimpleChannelItemReply {
  readonly id: string;
  readonly name: LocalizedPayload;
  readonly uom: Uom;
  readonly price: number;
  readonly itemCode?: string;
  readonly preferredType?: PreferredType;
  readonly retailer: IdPayload;
  readonly branch: IdPayload;
  readonly channel: IdPayload;
  readonly supplier: IdPayload;
  readonly retailerItem?: IdPayload;
  readonly supplierItem?: IdPayload;
  readonly state: ChannelItemState;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateChannelItemsResponse {
  readonly items: SimpleChannelItemReply[];
}

export interface CreateChannelItemPayload {
  readonly name: LocalizedPayload;
  readonly price: number;
  readonly priority?: boolean;
  readonly preferredType?: PreferredType;

  readonly uom?: Uom;
  readonly packaging: PackagingDataPayload;

  readonly supplierItem: IdPayload;
  readonly inventoryItem?: IdPayload;

  readonly retailerItem: IdPayload;
  readonly itemCode?: string;

  readonly retailer: IdPayload;
  readonly branch: IdPayload;
  readonly channel: IdPayload;
  readonly supplier: IdPayload;
  readonly location: IdPayload;
  readonly metadata?: BulkUploadMetadata;
}

export interface CreateChannelItemsPayload {
  readonly items: CreateChannelItemPayload[];
}

export type GetChannelItemsResponse = IQueryResponse<ChannelItem>;
export type GetChannelItemsPayload = IQuery<ChannelItem>;
