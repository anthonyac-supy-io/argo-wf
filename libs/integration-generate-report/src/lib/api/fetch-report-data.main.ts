import { serializeError } from 'serialize-error';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { getEnvArg } from '../common';
import { GenerateReportErrorHandler } from '../errors';
import { FetchReportDataInteractor } from '../logic';
import { AppModule } from './app.module';

export async function fetchReport(
  uniqueId: string,
  reportType: string,
  retailerId: string,
  userId: string
) {
  let exitCode = 0;
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const interactor = app.get(FetchReportDataInteractor);
    await interactor.execute(uniqueId);
  } catch (error) {
    Logger.error(
      '[Pusher] Generate Report Failed: Fetch Report Data Step',
      serializeError(error)
    );
    exitCode = 1;
    await app.get(GenerateReportErrorHandler).handle(
      error as Error,

      {
        title: 'Generate Report Failed: Fetch Report Data Step',
        message: (error as Error).message,
        reportType,
        retailerId,
        reportId: uniqueId,
      },
      {
        name: `private-cache-report-generate-workflow-${userId}`,
        eventName: 'report-generate-workflow.error',
      }
    );

    throw error;
  } finally {
    // eslint-disable-next-line no-console
    console.log('finally');
    await app.close();
    process.exit(exitCode);
  }
}

const uniqueId = getEnvArg('uniqueId');
const reportType = getEnvArg('reportType');
const retailerId = getEnvArg('retailerId');
const userId = getEnvArg('userId');
void fetchReport(uniqueId, reportType, retailerId, userId);
