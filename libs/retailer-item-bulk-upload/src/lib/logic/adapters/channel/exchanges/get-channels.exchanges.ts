import { IQuery, IQueryResponse } from '@supy.api/query';

import {
  BranchSnapshot,
  ChannelDisplayName,
  ChannelExternalType,
  ChannelState,
  PreferredType,
  SupplierSnapshot,
  UnreadMessages,
} from '../../../../common';

export interface GetPartyInfo {
  readonly supplier: SupplierSnapshot;

  readonly retailer: BranchSnapshot;
}
export interface GetChannelExternalResponse {
  readonly type: ChannelExternalType;
  readonly value: string;
}
export interface GetChannelMetadata {
  readonly externalRetailerId?: string;
  readonly externalRetailerIdLabel?: string;
}
export interface GetChannelResponse {
  readonly id: string;
  readonly displayName?: ChannelDisplayName;
  readonly externals?: GetChannelExternalResponse[];
  readonly lastMessageIndex: number;
  readonly lastOrderNumber: number;
  readonly retailerId: string;
  readonly supplierId: string;
  readonly parties: string[];
  readonly users: string[];
  readonly metadata?: GetChannelMetadata;
  readonly partyInfo?: GetPartyInfo;
  readonly state?: ChannelState;
  readonly comments?: string;
  readonly preferredType?: PreferredType;
  readonly unread?: UnreadMessages;
}
export type GetChannelsResponse = IQueryResponse<GetChannelResponse>;
export type GetChannelsPayload = IQuery<GetChannelResponse>;
