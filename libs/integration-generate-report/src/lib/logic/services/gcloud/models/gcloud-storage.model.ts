export interface GCloudStorageFileWrappedMetadata {
  readonly contentType?: string;
  readonly resumable?: boolean;
  readonly metadata?: GCloudStorageFileMetadata;
  readonly timeCreated?: Date;
}

export interface GCloudStorageFileMetadata {
  readonly createdBy?: string;
}
