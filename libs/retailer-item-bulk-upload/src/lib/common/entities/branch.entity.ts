import { IdPayload, SimpleOptionalEntity, SimpleUser } from '../../core';
import { Country } from './country.entity';
import { RetailerId } from './retailer.entity';

export enum BranchState {
  active = 'active',
  deleted = 'deleted',
}

export enum BranchType {
  centralKitchen = 'central-kitchen',
  branch = 'branch',
}

export interface BranchSnapshot {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly country: Country;
  readonly logoUrl?: string;
  readonly color?: string;
  readonly retailer: string;
  readonly outlet?: IdPayload;
}
export interface Branch {
  readonly id: string;
  readonly name: string;
  readonly type?: BranchType;
  readonly phone?: string;
  readonly email?: string;
  readonly address?: string;
  readonly logoUrl?: string;
  readonly city?: string;
  readonly country?: string;
  readonly countryId?: string;
  readonly state: BranchState;
  readonly outlet: SimpleOptionalEntity;
  readonly users: (string | SimpleUser)[];
  readonly retailer: RetailerId;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  readonly 'outlet.id'?: string;
  readonly 'outlet.name.en'?: string;
}

export interface LocationSnapshot extends BranchSnapshot {}
