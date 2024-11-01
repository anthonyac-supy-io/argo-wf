/* eslint-disable no-console */
import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';

import { getEnvArg } from '../common/utils';
import { SingleEntity } from '../logic/dtos';
import { UploadSingleEntityInteractor } from '../logic/interactors';
import { AppModule } from './app.module';

async function uploadEntity(input: SingleEntity) {
  const app = await NestFactory.createApplicationContext(AppModule);
  const interactor = app.get(UploadSingleEntityInteractor);
  await interactor.execute(input);
  console.log('before close');
  await app.close();
  console.log('before exit');
  process.exit(0);
}

const entityJsonPath = getEnvArg('entityFilePath');
const entity = JSON.parse(
  fs.readFileSync(entityJsonPath).toString()
) as SingleEntity;
void uploadEntity(entity).catch((error) => {
  console.log(error);

  throw error;
});
