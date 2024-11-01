import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@supy.api/microservices';
import { RedisClientType, RedisModule } from '@supy.api/redis';
import {
  DEFAULT_WEBSOCKET_SERVER,
  WebSocketServerModule,
} from '@supy.api/websockets';
import {
  ClientAdapterModule,
  NATS_CLIENT_AUDITLOGS,
  NATS_CLIENT_AUDITLOGS_OPTIONS,
  NATS_CLIENT_AUTHORIZATION,
  NATS_CLIENT_AUTHORIZATION_OPTIONS,
  NATS_CLIENT_CATALOG,
  NATS_CLIENT_CATALOG_OPTIONS,
  NATS_CLIENT_CORE,
  NATS_CLIENT_CORE_OPTIONS,
  NATS_CLIENT_INTEGRATIONS,
  NATS_CLIENT_INTEGRATIONS_OPTIONS,
  NATS_CLIENT_INVENTORY,
  NATS_CLIENT_INVENTORY_OPTIONS,
  NATS_CLIENT_NOTIFICATIONS,
  NATS_CLIENT_NOTIFICATIONS_OPTIONS,
  NATS_CLIENT_ORDERS,
  NATS_CLIENT_ORDERS_OPTIONS,
  NATS_CLIENT_SETTLEMENTS,
  NATS_CLIENT_SETTLEMENTS_OPTIONS,
} from '@supy/common';

import { GenerateReportModule } from '../generate-report.module';
import { GCloudStorageModule } from '../logic';

@Module({
  controllers: [],
  imports: [
    GenerateReportModule,
    ClientAdapterModule,
    ClientsModule.register([
      {
        name: NATS_CLIENT_CORE,
        transport: Transport.NATS,
        options: NATS_CLIENT_CORE_OPTIONS,
      },
      {
        name: NATS_CLIENT_ORDERS,
        transport: Transport.NATS,
        options: NATS_CLIENT_ORDERS_OPTIONS,
      },
      {
        name: NATS_CLIENT_CATALOG,
        transport: Transport.NATS,
        options: NATS_CLIENT_CATALOG_OPTIONS,
      },
      {
        name: NATS_CLIENT_AUDITLOGS,
        transport: Transport.NATS,
        options: NATS_CLIENT_AUDITLOGS_OPTIONS,
      },
      {
        name: NATS_CLIENT_SETTLEMENTS,
        transport: Transport.NATS,
        options: NATS_CLIENT_SETTLEMENTS_OPTIONS,
      },
      {
        name: NATS_CLIENT_AUTHORIZATION,
        transport: Transport.NATS,
        options: NATS_CLIENT_AUTHORIZATION_OPTIONS,
      },
      {
        name: NATS_CLIENT_INVENTORY,
        transport: Transport.NATS,
        options: NATS_CLIENT_INVENTORY_OPTIONS,
      },
      {
        name: NATS_CLIENT_INTEGRATIONS,
        transport: Transport.NATS,
        options: NATS_CLIENT_INTEGRATIONS_OPTIONS,
      },
      {
        name: NATS_CLIENT_NOTIFICATIONS,
        transport: Transport.NATS,
        options: NATS_CLIENT_NOTIFICATIONS_OPTIONS,
      },
    ]),
    RedisModule.forRoot({
      type: RedisClientType.Cluster,
      options: {
        nodes: [
          { host: process.env.REDIS_HOST_URL, port: +process.env.REDIS_PORT },
        ],
      },
    }),
    WebSocketServerModule.register({
      global: true,
      servers: [
        {
          token: DEFAULT_WEBSOCKET_SERVER,
          options: {
            appId: process.env.WEBSOCKET_DEFAULT_APP_ID,
            appKey: process.env.WEBSOCKET_DEFAULT_APP_KEY,
            appSecret: process.env.WEBSOCKET_DEFAULT_APP_SECRET,
            host: process.env.WEBSOCKET_DEFAULT_APP_HOST,
            port: process.env.WEBSOCKET_DEFAULT_APP_PORT,
          },
        },
      ],
    }),
    GCloudStorageModule.forRoot(),
  ],
})
export class AppModule {}
