import { Injectable, Logger } from '@nestjs/common';

import { SlackWebhookService } from '@supy.api/webhooks';

import { WorkflowStatus } from '../../common';
import { bulkUploadFinalisedSlackMessageTemplate } from '../templates/successfull-slack-message-template';

@Injectable()
export class SlackHandler {
  private readonly logger = new Logger(SlackHandler.name);

  constructor(private readonly slackWebhookService: SlackWebhookService) {}
  async notifyStatus(
    status: WorkflowStatus,
    retailerId: string
  ): Promise<void> {
    await this.postSlackMessage(
      bulkUploadFinalisedSlackMessageTemplate(status, retailerId)
    );
  }

  private async postSlackMessage(message: unknown): Promise<void> {
    try {
      this.logger.log({ slackMessage: message });

      await this.slackWebhookService.postMessage(message);
    } catch (error) {
      this.logger.error({
        message: `Couldn't connect to slack webhook channel: ${
          error as string
        }`,
      });
    }
  }
}
