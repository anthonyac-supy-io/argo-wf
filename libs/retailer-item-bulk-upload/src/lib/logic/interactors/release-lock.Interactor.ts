import { Injectable, Logger } from '@nestjs/common';

import { RedisClusterService } from '@supy.api/redis';

@Injectable()
export class ReleaseLockInteractor {
  private readonly logger = new Logger(ReleaseLockInteractor.name);

  constructor(private readonly redisClusterService: RedisClusterService) {}

  async execute(retailerId: string) {
    this.logger.log('---------FINAL STEP Start---------');
    this.logger.log('Retailer id : ' + retailerId);

    const redisResponse = await this.redisClusterService.get(
      `retailer-items:upload:${retailerId}`
    );

    if (redisResponse) {
      const { lockData } = JSON.parse(redisResponse as string) as {
        lockData: { key: string; hash: string };
      };
      await this.redisClusterService.deleteLock(lockData.key, lockData.hash);
      await this.redisClusterService.delete(
        `retailer-items:upload:${retailerId}`
      );
      this.logger.log('Unlocking Redis Key');
    }

    this.logger.log('---------FINAL STEP End---------');
  }
}
