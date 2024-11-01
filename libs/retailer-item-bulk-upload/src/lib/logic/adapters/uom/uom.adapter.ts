import { Injectable } from '@nestjs/common';

import { noLimit, query, where } from '@supy.api/query';
import { ClientAdapter } from '@supy/common';

import { Uom, UomType } from '../../../common';
import { GetUomsPayload, GetUomsResponse } from './exchanges';

@Injectable()
export class UomAdapter {
  constructor(private readonly client: ClientAdapter) {}

  async getUoms(): Promise<GetUomsResponse> {
    return await this.client.catalog.sendAsync<
      GetUomsResponse,
      GetUomsPayload,
      'uoms.get.many'
    >(
      'uoms.get.many',
      query<Uom>(where('type', 'in', UomType.Base), noLimit())
    );
  }
}
