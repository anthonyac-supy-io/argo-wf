import { Inject, Injectable, Logger } from '@nestjs/common';

import {
  DEFAULT_WEBSOCKET_SERVER,
  WebSocketServer,
} from '@supy.api/websockets';

interface WSMessage {
  title?: string;
  message: string;
  reportType: string;
  retailerId: string;
  reportId: string;
}
@Injectable()
export class GenerateReportErrorHandler {
  private readonly logger = new Logger(GenerateReportErrorHandler.name);

  constructor(
    @Inject(DEFAULT_WEBSOCKET_SERVER)
    private readonly websocketServer: WebSocketServer
  ) {}

  async handle(
    error: Error,
    message: WSMessage,
    {
      name,
      eventName,
    }: {
      name: `private-cache-report-generate-workflow-${string}`;
      eventName: string;
    }
  ): Promise<void> {
    this.logger.log({ error: error.message, message });
    await this.postWebsocketMessage(message, name, eventName);

    throw error;
  }

  private async postWebsocketMessage(
    message: WSMessage,
    channelName: `private-cache-report-generate-workflow-${string}`,
    eventName: string
  ) {
    try {
      await this.websocketServer.dispatch(channelName, eventName, {
        status: 'error',
        message,
        date: Date.now(),
        uuid: message.reportId,
      });
    } catch (error) {
      const errorMessage = `Message: ${JSON.stringify(
        message
      )} couldn't be pushed to ws channel: ${channelName} with event name: ${eventName} due to ws channel connection error: ${
        error as string
      }`;

      this.logger.error(errorMessage, error);

      throw error;
    }
  }
}
