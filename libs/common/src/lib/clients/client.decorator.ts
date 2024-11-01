import { NatsClientOptions, TcpClient } from '@supy.api/microservices';

const DEFAULT_NATS_TIMEOUT = 300000;

export const NATS_CLIENT_COMMON_OPTIONS: NatsClientOptions = {
  connection: {
    servers: process.env.NATS_SERVER,
    name: process.env.NATS_SERVICE_NAME,
  },
  prefix: process.env.NATS_SUBJECT_PREFIX,
  service: process.env.NATS_AUDITLOGS_SERVICE_NAME,
  timeout: DEFAULT_NATS_TIMEOUT,
  debug: process.env.NATS_DEBUG === true.toString(),
} as const;

export const NATS_CLIENT_INVENTORY_OPTIONS: NatsClientOptions = {
  ...NATS_CLIENT_COMMON_OPTIONS,
  service: process.env.NATS_INVENTORY_SERVICE_NAME,
} as const;

export const NATS_CLIENT_INTEGRATIONS_OPTIONS: NatsClientOptions = {
  ...NATS_CLIENT_COMMON_OPTIONS,
  service: process.env.NATS_INTEGRATIONS_SERVICE_NAME,
} as const;

export const NATS_CLIENT_SETTLEMENTS_OPTIONS: NatsClientOptions = {
  ...NATS_CLIENT_COMMON_OPTIONS,
  service: process.env.NATS_SETTLEMENTS_SERVICE_NAME,
} as const;

export const NATS_CLIENT_ORDERS_OPTIONS: NatsClientOptions = {
  ...NATS_CLIENT_COMMON_OPTIONS,
  service: process.env.NATS_ORDERS_SERVICE_NAME,
} as const;

export const NATS_CLIENT_NOTIFICATIONS_OPTIONS: NatsClientOptions = {
  ...NATS_CLIENT_COMMON_OPTIONS,
  service: process.env.NATS_NOTIFICATIONS_SERVICE_NAME,
} as const;

export const NATS_CLIENT_CORE_OPTIONS: NatsClientOptions = {
  ...NATS_CLIENT_COMMON_OPTIONS,
  service: process.env.NATS_CORE_SERVICE_NAME,
} as const;

export const NATS_CLIENT_CATALOG_OPTIONS: NatsClientOptions = {
  ...NATS_CLIENT_COMMON_OPTIONS,
  service: process.env.NATS_CATALOG_SERVICE_NAME,
} as const;

export const NATS_CLIENT_AUTHORIZATION_OPTIONS: NatsClientOptions = {
  ...NATS_CLIENT_COMMON_OPTIONS,
  service: process.env.NATS_AUTHORIZATION_SERVICE_NAME,
} as const;

export const NATS_CLIENT_AUDITLOGS_OPTIONS: NatsClientOptions = {
  ...NATS_CLIENT_COMMON_OPTIONS,
  service: process.env.NATS_AUDITLOGS_SERVICE_NAME,
} as const;

export const TCP_CLIENT_SETTLEMENTS_OPTIONS = {
  host: process.env.SETTLEMENTS_SERVICE_HOST,
  port: +process.env.SETTLEMENTS_API_SERVICE_PORT,
  timeout: 300000,
};
export const TCP_CLIENT_SETTLEMENTS = Symbol('TCP_CLIENT_SETTLEMENTS');

export const TcpClientSettlements = () =>
  TcpClient(TCP_CLIENT_SETTLEMENTS_OPTIONS);

export const TCP_CLIENT_CORE_OPTIONS = {
  host: process.env.CORE_API_SERVICE_HOST,
  port: +process.env.CORE_API_SERVICE_PORT,
  timeout: 300000,
};
export const TCP_CLIENT_CORE = Symbol('TCP_CLIENT_CORE');

export const TcpClientCore = () => TcpClient(TCP_CLIENT_CORE_OPTIONS);
