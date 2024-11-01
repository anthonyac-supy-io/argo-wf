import { Inject, Injectable, Logger } from '@nestjs/common';

import { RedisClusterService } from '@supy.api/redis';
import {
  DEFAULT_WEBSOCKET_SERVER,
  WebSocketServer,
} from '@supy.api/websockets';

import { ReportAdapter } from '../adapters';
import { GenerateReportInput, UploadReportInput } from '../dtos';

@Injectable()
export class UploadReportInteractor {
  constructor(
    private readonly reportAdapter: ReportAdapter,
    private readonly redisClusterService: RedisClusterService,
    @Inject(DEFAULT_WEBSOCKET_SERVER)
    private readonly websocketServer: WebSocketServer
  ) {}

  async execute({ reportId, data }: UploadReportInput): Promise<void> {
    const redisResponse = await this.redisClusterService.get(
      `workflow:report:generate:${reportId}`
    );

    if (!redisResponse) {
      throw new Error('Could Not Fetch Data From Redis');
    }

    const input = JSON.parse(redisResponse as string) as GenerateReportInput;
    const url = await this.reportAdapter.uploadReport({ input, data });
    Logger.log('url', url);
    await this.websocketServer.dispatch(
      `private-cache-report-generate-workflow-${input.submittedBy.id}`,
      'report-generate-workflow.success',
      {
        status: 'finalizing',
        message: {
          message: `${input.reportType} Report Generated Successfully. To maintain accuracy, the report will be available for up to 3 hours.`,
          reportType: input.reportType,
          retailerId: input.retailer.id,
          reportUrl: url,
        },
        date: Date.now(),
        uuid: reportId,
      }
    );
  }
}
