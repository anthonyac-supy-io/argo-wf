export interface GCloudStorageParams {
  bucketName: string;
  filePath: string;
  expireFromDate?: Date;
  urlMinutesLifetime?: number;
}
