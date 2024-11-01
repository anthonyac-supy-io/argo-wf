import { Global, Module } from '@nestjs/common';

import { ClientAdapter } from './client.adapter';

@Global()
@Module({
  providers: [ClientAdapter],
  exports: [ClientAdapter],
})
export class ClientAdapterModule {}
