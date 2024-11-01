import { Module } from '@nestjs/common';

import {
  BranchAdapter,
  ChannelAdapter,
  ChannelItemAdapter,
  InventoryItemAdapter,
  PackagingItemAdapter,
  RetailerAdapter,
  RetailerItemAdapter,
  RetailerItemCategoryAdapter,
  SupplierAdapter,
  SupplierItemAdapter,
  UomAdapter,
  UserAdapter,
} from './logic/adapters';
import {
  ReleaseLockInteractor,
  UploadEntitiesInteractor,
  UploadSingleEntityInteractor,
} from './logic/interactors';

@Module({
  controllers: [],
  providers: [
    ReleaseLockInteractor,
    UploadEntitiesInteractor,
    UploadSingleEntityInteractor,
    RetailerAdapter,
    BranchAdapter,
    SupplierAdapter,
    UomAdapter,
    UserAdapter,
    ChannelAdapter,
    RetailerItemAdapter,
    ChannelItemAdapter,
    PackagingItemAdapter,
    InventoryItemAdapter,
    SupplierItemAdapter,
    RetailerItemCategoryAdapter,
  ],
  exports: [
    ReleaseLockInteractor,
    RetailerItemCategoryAdapter,
    UploadEntitiesInteractor,
    UploadSingleEntityInteractor,
    RetailerAdapter,
    BranchAdapter,
    SupplierAdapter,
    UomAdapter,
    UserAdapter,
    ChannelAdapter,
    RetailerItemAdapter,
    ChannelItemAdapter,
    PackagingItemAdapter,
    InventoryItemAdapter,
    SupplierItemAdapter,
  ],
})
export class RetailerItemBulkUploadModule {}
