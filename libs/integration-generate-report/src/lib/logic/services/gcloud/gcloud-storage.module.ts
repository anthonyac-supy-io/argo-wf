import { JWTInput } from 'google-auth-library';
import { Storage } from '@google-cloud/storage';
import { DynamicModule, Module } from '@nestjs/common';

import {
  GCloudStorageInstance,
  GCloudStorageService,
} from './gcloud-storage.service';

@Module({
  providers: [],
  exports: [],
})
export class GCloudStorageModule {
  static forRoot(): DynamicModule {
    const {
      client_email,
      private_key,
      project_id: projectId,
    } = JSON.parse(process.env.GCLOUD_STORAGE_SERVICE_ACCOUNT_KEY) as JWTInput;

    return {
      module: GCloudStorageModule,
      global: true,
      providers: [
        {
          provide: GCloudStorageInstance,
          useFactory: () => {
            return new Storage({
              credentials: {
                client_email,
                private_key,
              },
              projectId,
            });
          },
        },
        GCloudStorageService,
      ],
      exports: [GCloudStorageService],
    };
  }
}
