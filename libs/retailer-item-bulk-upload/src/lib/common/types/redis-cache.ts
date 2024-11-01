import { RetailerItemInput } from '../../logic';

export interface BulkUploadCache {
  user: string;
  lockData: {
    hash: string;
    key: string;
  };
  items: RetailerItemInput[];
  retailerId: string;
}