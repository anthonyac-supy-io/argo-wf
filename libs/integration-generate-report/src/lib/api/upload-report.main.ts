import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { getEnvArg, readFileAsBuffer } from '../common';
import { GenerateReportErrorHandler } from '../errors';
import { UploadReportInteractor } from '../logic';
import { AppModule } from './app.module';

const __dir = `/workflow/output`;
const path = `${__dir}/report-data-buffer`;

export async function uploadReport(
  uniqueId: string,
  reportType: string,
  retailerId: string,
  userId: string
) {
  const app = await NestFactory.createApplicationContext(AppModule);
  let exitCode = 0;

  try {
    const interactor = app.get(UploadReportInteractor);
    const data = await readFileAsBuffer(path);
    Logger.log('Upload Report Main');
    await interactor.execute({ reportId: uniqueId, data });
  } catch (error) {
    exitCode = 1;
    await app.get(GenerateReportErrorHandler).handle(
      error as Error,
      {
        title: 'Generate Report Failed: Upload Report Step',
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
    await app.close();
    process.exit(exitCode);
  }
}

const uniqueId = getEnvArg('uniqueId');
const reportType = getEnvArg('reportType');
const retailerId = getEnvArg('retailerId');
const userId = getEnvArg('userId');
void uploadReport(uniqueId, reportType, retailerId, userId);
