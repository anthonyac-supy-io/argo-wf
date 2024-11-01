import { NestFactory } from '@nestjs/core';

import { WorkflowStatus } from '../common';
import { getEnvArg } from '../common/utils';
import { ReleaseLockInteractor } from '../logic/interactors';
import { SlackHandler } from '../logic/message-handler/slack-handler';
import { AppModule } from './app.module';

async function releaseLock(retailerId: string, status: WorkflowStatus) {
  const app = await NestFactory.createApplicationContext(AppModule);
  const interactor = app.get(ReleaseLockInteractor);
  await interactor.execute(retailerId);
  await app.get(SlackHandler).notifyStatus(status, retailerId);
  await app.close();
  process.exit();
}

const retailerId = getEnvArg('retailerId');
const status = getEnvArg('status') as unknown as WorkflowStatus;
void releaseLock(retailerId, status);
