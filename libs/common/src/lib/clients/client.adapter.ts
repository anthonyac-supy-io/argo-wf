import { Inject, Injectable } from '@nestjs/common';

import { IClientProxy, TcpClientProxy } from '@supy.api/microservices';

import { TCP_CLIENT_CORE_OPTIONS, TCP_CLIENT_SETTLEMENTS_OPTIONS } from './client.decorator';
import {
  NATS_CLIENT_AUDITLOGS,
  NATS_CLIENT_AUTHORIZATION,
  NATS_CLIENT_CATALOG,
  NATS_CLIENT_CORE,
  NATS_CLIENT_INTEGRATIONS,
  NATS_CLIENT_INVENTORY,
  NATS_CLIENT_NOTIFICATIONS,
  NATS_CLIENT_ORDERS,
  // NATS_CLIENT_SETTLEMENTS,
} from './client.token';

@Injectable()
export class ClientAdapter {
  readonly _core: IClientProxy =  new TcpClientProxy(
    TCP_CLIENT_CORE_OPTIONS
  );

  readonly #core: IClientProxy;

  readonly #orders: IClientProxy;

  readonly #catalog: IClientProxy;

  readonly #auditlogs: IClientProxy;

  readonly #authorization: IClientProxy;

  readonly _settlements: IClientProxy = new TcpClientProxy(
    TCP_CLIENT_SETTLEMENTS_OPTIONS
  );

  readonly #inventory: IClientProxy;

  readonly #integrations: IClientProxy;

  readonly #notifications: IClientProxy;

  constructor(
    @Inject(NATS_CLIENT_CORE) core: IClientProxy,
    @Inject(NATS_CLIENT_ORDERS) orders: IClientProxy,
    @Inject(NATS_CLIENT_CATALOG) catalog: IClientProxy,
    @Inject(NATS_CLIENT_AUDITLOGS) auditlogs: IClientProxy,
    @Inject(NATS_CLIENT_AUTHORIZATION) authorization: IClientProxy,
    // @Inject(NATS_CLIENT_SETTLEMENTS) settlements: IClientProxy,
    @Inject(NATS_CLIENT_INVENTORY) inventory: IClientProxy,
    @Inject(NATS_CLIENT_INTEGRATIONS) integrations: IClientProxy,
    @Inject(NATS_CLIENT_NOTIFICATIONS) notifications: IClientProxy
  ) {
    this.#core = core;
    this.#orders = orders;
    this.#catalog = catalog;
    this.#auditlogs = auditlogs;
    this.#authorization = authorization;
    // this.#settlements = settlements;
    this.#inventory = inventory;
    this.#integrations = integrations;
    this.#notifications = notifications;
  }

  get core(): IClientProxy {
    return this.#core;
  }

  get coreTCP(): IClientProxy {
    return this._core;
  }

  get orders(): IClientProxy {
    return this.#orders;
  }

  get catalog(): IClientProxy {
    return this.#catalog;
  }

  get auditlogs(): IClientProxy {
    return this.#auditlogs;
  }

  get authorization(): IClientProxy {
    return this.#authorization;
  }

  get settlements(): IClientProxy {
    return this._settlements;
  }

  get inventory(): IClientProxy {
    return this.#inventory;
  }

  get integrations(): IClientProxy {
    return this.#integrations;
  }

  get notifications(): IClientProxy {
    return this.#notifications;
  }
}
