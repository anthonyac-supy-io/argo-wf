import { Injectable, Logger } from '@nestjs/common';

import { RedisClusterService } from '@supy.api/redis';

import { ReleaseLockDataPayload } from '../adapters';

@Injectable()
export class ReleaseLockInteractor {
  private readonly logger = new Logger(ReleaseLockInteractor.name);

  constructor(private readonly redisClusterService: RedisClusterService) {}

  async execute(reportId: string) {
    this.logger.log('---------FINAL STEP Start---------');

    const redisResponse = await this.redisClusterService.get(
      `workflow:report:generate:${reportId}`
    );
    this.logger.log('reddis response :', JSON.stringify(redisResponse));

    if (redisResponse) {
      const { lockData, submittedBy } = JSON.parse(
        redisResponse as string
      ) as ReleaseLockDataPayload;
      this.logger.log('User id : ' + submittedBy.id);

      await this.redisClusterService.deleteLock(lockData.key, lockData.hash);
      await this.redisClusterService.delete(
        `workflow:report:generate:${reportId}`
      );
      this.logger.log('Unlocking Redis Key');
    }

    this.logger.log('---------FINAL STEP End---------');
  }
}
