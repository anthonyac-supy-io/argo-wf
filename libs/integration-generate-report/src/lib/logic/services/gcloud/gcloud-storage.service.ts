import ms from 'ms';
import * as Stream from 'stream';
import { File, GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { SignerGetSignedUrlResponse } from '@google-cloud/storage/build/src/signer';
import { Injectable } from '@nestjs/common';

import { UnknownError } from '@supy.api/errors';

import { GCloudStorageParams } from './gcloud-storage.params';
import { GCloudStorageFileMetadata } from './models';

export abstract class GCloudStorageInstance implements Storage {}
export interface GCloudStorageInstance extends Storage {}
@Injectable()
export class GCloudStorageService {
  constructor(private readonly app: GCloudStorageInstance) {}

  async getSignedUrl(
    params: GCloudStorageParams
  ): Promise<SignerGetSignedUrlResponse> {
    const expiredUrlDate = new Date();
    expiredUrlDate.setTime(expiredUrlDate.getTime() + 1000);

    const calculatedExpiryDate = new Date(
      (params.expireFromDate
        ? new Date(params.expireFromDate).getTime()
        : Date.now()) + ms(`${params.urlMinutesLifetime ?? 15}m`)
    );

    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'read',
      expires:
        new Date(calculatedExpiryDate).getTime() < Date.now()
          ? expiredUrlDate
          : calculatedExpiryDate,
    };

    const [signedUrl] = await this.app
      .bucket(params.bucketName)
      .file(params.filePath)
      .getSignedUrl(options);

    return signedUrl;
  }

  //TODO: refactor to use storeFile instead
  async storePdf(
    pdfReport: Buffer,
    params: GCloudStorageParams,
    metadata?: GCloudStorageFileMetadata
  ): Promise<void> {
    const contents = pdfReport;

    try {
      await this.app
        .bucket(params.bucketName)
        .file(params.filePath)
        .save(contents, {
          metadata: {
            metadata,
          },
        });
    } catch (e) {
      throw new UnknownError(`Unable to store PDF`);
    }
  }

  async storeFile(
    fileBuffer: Buffer,
    params: GCloudStorageParams,
    errorMsgs?: string,
    metadata?: GCloudStorageFileMetadata
  ): Promise<void> {
    const contents = fileBuffer;

    try {
      await this.app
        .bucket(params.bucketName)
        .file(params.filePath)
        .save(contents, {
          metadata: {
            metadata,
          },
        });
    } catch (e) {
      throw new UnknownError(errorMsgs ?? `Unable to create file.`);
    }
  }

  storeFileStream(
    stream: Stream,
    params: GCloudStorageParams,
    errorMsgs?: string,
    metadata?: GCloudStorageFileMetadata
  ): Stream {
    try {
      const uploadStream = this.app
        .bucket(params.bucketName)
        .file(params.filePath)
        .createWriteStream({
          metadata: {
            metadata,
          },
        });

      stream.pipe(uploadStream);

      return uploadStream;
    } catch (e) {
      throw new UnknownError(errorMsgs ?? `Unable to create file.`);
    }
  }

  async streamToPromise(stream: Stream, errorMsgs?: string): Promise<void> {
    try {
      await new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
      });
    } catch (e) {
      throw new UnknownError(errorMsgs ?? `Unable to create file.`);
    }
  }

  async getBucketFiles(params: GCloudStorageParams): Promise<File[]> {
    const [files] = await this.app
      .bucket(params.bucketName)
      .getFiles({ prefix: params.filePath });

    return files;
  }
}
