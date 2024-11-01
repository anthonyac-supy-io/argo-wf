import { IdPayload, LocalizedPayload } from '../../core';

export enum RetailerItemCategoryState {
  active = 'active',
  deleted = 'deleted',
}
export interface RetailerItemCategory {
  readonly id: string;
  readonly retailerId: string;
  readonly parent?: IdPayload;
  readonly parentCategory?: RetailerItemCategory[];
  readonly version?: number;
  readonly 'name.en'?: string;
  readonly 'name.ar'?: string;
  readonly name: LocalizedPayload;
  readonly state: RetailerItemCategoryState;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
