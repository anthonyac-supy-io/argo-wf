import { CountryAlpha2, Currency } from '@supy.api/dictionaries';

import { GetSimpleUserResponse, IdPayload } from '../../core';
import { CountryState } from './country.entity';

export enum SupplierState {
  Active = 'active',
  Deleted = 'deleted',
  Pending = 'pending',
}

export enum SupplierType {
  Supplier = 'supplier',
  CentralKitchen = 'central-kitchen',
  Category = 'category',
}
export enum SupplierPartnershipTypeEnum {
  Integrated = 'integrated',
  Independent = 'independent',
}

export enum IntegratedUnitTypeEnum {
  Uom = 'uom',
  Package = 'package',
}
export interface IntegratedUnit extends IdPayload {
  readonly name: string;

  readonly reference?: IdPayload;

  readonly scope: IntegratedUnitTypeEnum;

  readonly isFixedQuantity?: boolean;
}
export interface GetSupplierMetadataResponse {
  readonly taxRegistrationNumber?: string;
  readonly warehouseId?: string;
  readonly retailerId?: string;
  readonly partnershipType?: SupplierPartnershipTypeEnum;
  readonly partnershipContact?: string;
  readonly adHoc?: boolean;
  readonly integratedUnits: IntegratedUnit[];
}

export interface GetSupplierSettingsResponse {
  readonly minOrderValue?: number;
  readonly cutOffTime?: number;
  readonly color?: string;
}
export interface GetCountryResponse {
  readonly id: string;
  readonly name: string;
  readonly code: CountryAlpha2;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly currency: Currency;
  readonly state: CountryState;
}
export interface Supplier {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly phone: string;
  readonly address: string;
  readonly countryId?: string;
  readonly country?: GetCountryResponse;
  readonly logoUrl?: string;
  readonly users: (string | GetSimpleUserResponse)[];
  readonly type?: SupplierType;
  readonly state?: SupplierState;
  readonly metadata?: GetSupplierMetadataResponse;
  readonly settings?: GetSupplierSettingsResponse;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
export interface SupplierMetadataSnapshot {
  readonly taxRegistrationNumber?: string;
  readonly warehouseId?: string;
  readonly partnershipType?: SupplierPartnershipTypeEnum;
  readonly partnershipContact?: string;
  readonly integratedUnits?: IntegratedUnit[];
}
export interface SupplierSnapshot {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly phone: string;
  readonly address?: string;
  readonly type?: SupplierType;
  readonly metadata?: SupplierMetadataSnapshot;
}
