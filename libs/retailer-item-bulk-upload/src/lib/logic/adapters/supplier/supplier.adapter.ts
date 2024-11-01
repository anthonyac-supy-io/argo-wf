import { Injectable } from '@nestjs/common';

import { and, noLimit, query, where } from '@supy.api/query';
import { ClientAdapter } from '@supy/common';

import { Supplier, SupplierState } from '../../../common';
import { GetSuppliersPayload, GetSuppliersResponse } from './exchanges';

@Injectable()
export class SupplierAdapter {
  constructor(private readonly client: ClientAdapter) {}

  async getSuppliersByName(
    supplierNames: string[]
  ): Promise<GetSuppliersResponse> {
    return await this.client.core.sendAsync<
      GetSuppliersResponse,
      GetSuppliersPayload,
      'suppliers.get.many'
    >(
      'suppliers.get.many',
      query<Supplier>(
        and(
          where('name', 'in', supplierNames),
          where('state', 'neq', SupplierState.Deleted)
        ),
        noLimit()
      )
    );
  }
}
