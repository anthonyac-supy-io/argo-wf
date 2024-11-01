import { NestFactory } from '@nestjs/core';

import { getEnvArg } from '../common/utils';
import { BulkUploadErrorHandler } from '../logic';
import { UploadEntitiesInteractor } from '../logic/interactors';
import { AppModule } from './app.module';

async function uploadEntities(retailerId: string, userId: string) {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const interactor = app.get(UploadEntitiesInteractor);
    await interactor.execute(retailerId, userId);
  } catch (error) {
    await app
      .get(BulkUploadErrorHandler)
      .handle(
        error as Error,
        `retailer-items:upload:${retailerId}`,
        'Retailer Item Bulk Upload Failed: Process Items Step '
      );
  } finally {
    await app.close();
    process.exit();
  }
}

const userId = getEnvArg('userId');
const retailerId = getEnvArg('retailerId');

void uploadEntities(retailerId, userId);
