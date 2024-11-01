import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { getEnvArg } from '../common/utils';
import { GenerateReportErrorHandler } from '../errors';
import { ReleaseLockInteractor } from '../logic/interactors';
import { AppModule } from './app.module';

export async function releaseLock(
  retailerId: string,
  uniqueId: string,
  reportType: string
) {
  const app = await NestFactory.createApplicationContext(AppModule);
  let exitCode = 0;

  try {
    const interactor = app.get(ReleaseLockInteractor);
    Logger.log('Release lock Main');
    await interactor.execute(uniqueId);
  } catch (error) {
    exitCode = 1;
    await app.get(GenerateReportErrorHandler).handle(
      error as Error,
      {
        title: 'Generate Report Failed: Release Lock Step',
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
void releaseLock(retailerId, uniqueId, reportType);
