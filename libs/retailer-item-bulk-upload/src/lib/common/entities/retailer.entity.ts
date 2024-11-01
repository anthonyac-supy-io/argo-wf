import { Currency } from '@supy.api/dictionaries';

import { IdPayload } from '../../core';

export type RetailerId = string;

export enum RetailerState {
  active = 'active',
  deleted = 'deleted',
}

export enum RetailerUserRole {
  manager = 'manager',
  staff = 'staff',
}

export interface RetailerMetadata {
  readonly color?: string;
}
export interface RetailerSnapshot {
  readonly id: string;
  readonly name: string;
  readonly metadata?: RetailerMetadata;
}

export interface RetailerCountrySnapshot extends IdPayload {
  readonly code?: string;
  readonly name?: string;
}
export interface Retailer {
  readonly id: RetailerId;

  readonly name: string;

  readonly logoUrl?: string;

  readonly state: RetailerState;

  readonly metadata: RetailerMetadata;

  readonly branches: number;

  readonly country?: RetailerCountrySnapshot;
  readonly currency?: Currency;

  readonly createdAt: Date;

  readonly updatedAt: Date;
}
