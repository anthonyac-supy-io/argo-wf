import { Inject, Injectable, Logger } from '@nestjs/common';

import { RedisClusterService } from '@supy.api/redis';
import {
  DEFAULT_WEBSOCKET_SERVER,
  WebSocketServer,
} from '@supy.api/websockets';

import { streamJsonToFile } from '../../common';
import { ReportAdapter } from '../adapters';
import { FetchReportDataPayload } from '../adapters/exchanges';
import { GenerateInventoryReportsOutput } from '../dtos/report.output';

const __dir = `/workflow/output`;
const path = `${__dir}/bq-report-data.json`;

@Injectable()
export class FetchReportDataInteractor {
  constructor(
    private readonly reportAdapter: ReportAdapter,
    private readonly redisClusterService: RedisClusterService,
    @Inject(DEFAULT_WEBSOCKET_SERVER)
    private readonly websocketServer: WebSocketServer
  ) {}

  async execute(reportId: string): Promise<void> {
    const payload =
      await this.redisClusterService.getAs<FetchReportDataPayload>(
        `workflow:report:generate:${reportId}`
      );

    if (!payload) {
      throw new Error('Could Not Fetch Data From Redis');
    }

    Logger.log(JSON.stringify(payload));
    Logger.log('before fetchReportData');
    await this.websocketServer.dispatch(
      `private-cache-report-generate-workflow-${payload.submittedBy.id}`,
      'report-generate-workflow.initialize',
      {
        status: 'initializing',
        message: {
          message: `Your report is being generated. This may take a few minutes. To maintain accuracy, the report will be available for up to 3 hours once generated.`,
          reportType: payload.reportType,
          retailerId: payload.retailer.id,
        },
        date: Date.now(),
        uuid: reportId,
      }
    );

    const reportData = await this.reportAdapter.fetchReportData(payload);
    Logger.log('after fetchReportData');
    await streamJsonToFile<{ payload: GenerateInventoryReportsOutput }>(
      { payload: reportData },
      path
    );
    Logger.log('after streamJsonToFile');
  }
}
