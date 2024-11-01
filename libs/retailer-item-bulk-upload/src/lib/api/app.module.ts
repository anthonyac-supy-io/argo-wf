import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@supy.api/microservices';
import { RedisClientType, RedisModule } from '@supy.api/redis';
import { WebhooksModule } from '@supy.api/webhooks';
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

import { BulkUploadErrorHandler, SlackHandler } from '../logic';
import { RetailerItemBulkUploadModule } from '../retailer-item-bulk-upload.module';

@Module({
  imports: [
    SlackHandler,
    BulkUploadErrorHandler,
    RetailerItemBulkUploadModule,
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
    WebhooksModule.forRoot({
      slackWebhookUrl: process.env.SLACK_WEBHOOK,
      slackWebhookEnabled: process.env.SLACK_WEBHOOK_ENABLED === 'true',
    }),
  ],
})
export class AppModule {}
