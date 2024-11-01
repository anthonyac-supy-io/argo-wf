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
} from '../adapters';
import { branchAdapterMock } from '../adapters/branch/branch.adapter.mock';
import { channelAdapterMock } from '../adapters/channel/channel.adapter.mock';
import { channelItemAdapterMock } from '../adapters/channel-item/channel-item.adapter.mock';
import { inventoryItemAdapterMock } from '../adapters/inventory-item/inventory-item.adapter.mock';
import { packagingItemAdapterMock } from '../adapters/packaging-item/packaging-item.adapter.mock';
import { retailerAdapterMock } from '../adapters/retailer/retailer.adapter.mock';
import { retailerItemAdapterMock } from '../adapters/retailer-item/retailer-item.adapter.mock';
import { retailerItemCategoryAdapterMock } from '../adapters/retailer-item-category/retailer-item-category.adapter.mock';
import { supplierAdapterMock } from '../adapters/supplier/supplier.adapter.mock';
import { supplierItemAdapterMock } from '../adapters/supplier-item/supplier-item.adapter.mock';
import { uomAdapterMock } from '../adapters/uom/uom.adapter.mock';
import { userAdapterMock } from '../adapters/user/user.adapter.mock';
import { UploadEntitiesInteractor } from './upload-entities.interactor';
import { UploadSingleEntityInteractor } from './upload-single-entity.interactor';

export const TestModule = {
  providers: [
    {
      provide: RetailerItemCategoryAdapter,
      useValue: retailerItemCategoryAdapterMock,
    },
    { provide: RetailerAdapter, useValue: retailerAdapterMock },
    { provide: BranchAdapter, useValue: branchAdapterMock },
    { provide: SupplierAdapter, useValue: supplierAdapterMock },
    { provide: UomAdapter, useValue: uomAdapterMock },
    { provide: UserAdapter, useValue: userAdapterMock },
    { provide: ChannelAdapter, useValue: channelAdapterMock },
    { provide: RetailerItemAdapter, useValue: retailerItemAdapterMock },
    { provide: ChannelItemAdapter, useValue: channelItemAdapterMock },
    { provide: PackagingItemAdapter, useValue: packagingItemAdapterMock },
    { provide: InventoryItemAdapter, useValue: inventoryItemAdapterMock },
    { provide: SupplierItemAdapter, useValue: supplierItemAdapterMock },
    UploadSingleEntityInteractor,
    UploadEntitiesInteractor,
  ],
};
