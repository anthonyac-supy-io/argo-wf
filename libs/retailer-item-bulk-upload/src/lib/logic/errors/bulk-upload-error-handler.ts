import { Injectable, Logger } from '@nestjs/common';

import { RedisClusterService } from '@supy.api/redis';
import { SlackWebhookService } from '@supy.api/webhooks';

import { BulkUploadCache } from '../../common';
import { invalidBulkUploadSlackMessageTemplate } from './slack-message-templates';

@Injectable()
export class BulkUploadErrorHandler {
  private readonly logger = new Logger(BulkUploadErrorHandler.name);

  constructor(
    private readonly redisClusterService: RedisClusterService,
    private readonly slackWebhookService: SlackWebhookService
  ) {}

  async handle(error: Error, redisKey: string, message: string): Promise<void> {
    this.logger.log({ error: error.message, redisKey, message });

    await this.doRedisDependentShutdown(message, redisKey, error);
  }

  private async doRedisDependentShutdown(
    message: string,
    redisKey: string,
    error: unknown
  ) {
    await this.validateRedisAvailability(redisKey, error);

    const { lockData, retailerId } = await this.getRedisRecord(redisKey);

    await this.postSlackMessage(
      invalidBulkUploadSlackMessageTemplate(message, error, retailerId)
    );

    await this.disposeRedis(redisKey, lockData);
  }

  private async disposeRedis(
    redisKey: string,
    lockData: { key: string; hash: string }
  ) {
    await this.redisClusterService.delete(redisKey);
    await this.redisClusterService.deleteLock(lockData.key, lockData.hash);
  }

  private async getRedisRecord(redisKey: string) {
    return JSON.parse(
      (await this.redisClusterService?.get(redisKey)) as string
    ) as BulkUploadCache;
  }

  private async validateRedisAvailability(
    redisKey: string,
    error: unknown
  ): Promise<void> {
    const redisRecord = await this.redisClusterService?.get(redisKey);

    if (!redisRecord) {
      const message = `Redis is not accessible or record with the key: "${redisKey}" is missing. Lock cannot be disposed properly`;

      await this.postSlackMessage(
        invalidBulkUploadSlackMessageTemplate(message, error)
      );

      this.logger.error(message);

      throw new Error(message);
    }
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
