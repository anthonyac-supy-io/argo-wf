import { IdPayload } from '../../../../core';

export enum UserState {
  active = 'active',
  blocked = 'blocked',
  deleted = 'deleted',
}

export interface UserSettings {
  readonly chat: boolean;
  readonly order: boolean;
  readonly showApproxPrice: boolean;
  readonly sendNewOrderEmail: boolean;
}
export interface GetUserResponse {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly photoUrl?: string;
  readonly email?: string;
  readonly phone: string;
  readonly state: UserState;
  readonly settings: UserSettings;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
export type GetUserPayload = IdPayload;
