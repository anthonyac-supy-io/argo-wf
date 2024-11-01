import { Retailer } from '../../../../common';
import { IdPayload } from '../../../../core';

export type GetRetailerPayload = IdPayload;
export interface GetRetailerResponse extends Retailer {}
