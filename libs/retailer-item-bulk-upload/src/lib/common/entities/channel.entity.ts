export enum ChannelExternalType {
  whatsapp = 'whatsapp',
  email = 'email',
}
export enum MessageType {
  text = 'text',
  order = 'order',
  item = 'item',
}

export enum ChannelState {
  Active = 'active',
  Deleted = 'deleted',
}
export interface ChannelMetadata {
  readonly externalRetailerId?: string;
  readonly externalRetailerIdLabel?: string;
}

export interface ChannelExternal {
  readonly type: ChannelExternalType;
  readonly value: string;
}
export interface ChannelDisplayName {
  readonly supplier: string;
}
export type UnreadMessages = {
  [key in string]: number;
};
export interface Message {
  readonly id?: string;
  readonly index?: number;
  readonly userId: string;
  readonly userName?: { firstName: string; lastName: string };
  readonly channelId: string;
  readonly text: string;
  readonly type: MessageType;
  readonly createdAt: Date;
}
export enum PreferredType {
  Regular = 'regular',
  RevenueSharing = 'revenueSharing',
  Referral = 'referral',
}
export interface Channel {
  readonly id: string;
  readonly displayName?: ChannelDisplayName;
  readonly externals: ChannelExternal[];
  lastMessageIndex: number;
  readonly lastMessage?: Message;
  lastOrderNumber: number;
  readonly retailerId: string;
  readonly supplierId: string;
  readonly parties: string[];
  readonly users: string[];
  readonly preferredType?: PreferredType;
  readonly unread: UnreadMessages;
  readonly metadata: ChannelMetadata;
  readonly state: ChannelState;
}
