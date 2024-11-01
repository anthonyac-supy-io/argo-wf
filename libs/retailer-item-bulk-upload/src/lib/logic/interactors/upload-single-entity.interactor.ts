import { plainToInstance } from 'class-transformer';
import { Injectable, Logger } from '@nestjs/common';

import {
  Branch,
  hashObjectSha1,
  InventoryItem,
  Packaging,
  removeTimestamps,
  Supplier,
  Uom,
} from '../../common';
import {
  InvoiceUnit,
  InvoiceUnitType,
  PackagingDataPayload,
  PackagingSourceScopeEnum,
  SimpleEntity,
  SimpleUser,
  SupplierItemCreationSource,
} from '../../core';
import {
  ChannelItemAdapter,
  CreateChannelItemPayload,
  CreateInventoryItemPayload,
  CreateRetailerItemPayload,
  CreateSupplierItemPayload,
  CreateSupplierItemResponse,
  GetChannelItemsResponse,
  GetChannelResponse,
  InventoryItemAdapter,
  PackagingItemAdapter,
  RetailerItemAdapter,
  RetailerItemResponse,
  SetInventoryItemPayload,
  SupplierItemAdapter,
} from '../adapters';
import { CreatePackagingPayload } from '../adapters/packaging-item/exchanges';
import {
  PackagingSupplierInput,
  PackagingWithChildrenInput,
  SingleEntity,
} from '../dtos';

@Injectable()
export class UploadSingleEntityInteractor {
  private readonly logger = new Logger(UploadSingleEntityInteractor.name);
  private entityInventoryItem: SetInventoryItemPayload;

  constructor(
    private readonly retailerItemAdapter: RetailerItemAdapter,
    private readonly channelItemAdapter: ChannelItemAdapter,
    private readonly packagingItemAdapter: PackagingItemAdapter,
    private readonly inventoryItemAdapter: InventoryItemAdapter,
    private readonly supplierItemAdapter: SupplierItemAdapter
  ) {}

  async execute(input: SingleEntity): Promise<{ packages: Packaging[] }> {
    try {
      const {
        locations,
        userInstance,
        retailerInstance,
        baseUnit,
        suppliers,
        possibleIntegratedSupplierUnitsMap,
        allRetailerChannels,
        createRetailerItemPayload,
        packagingOptions,
      } = input;
      const dateNow = new Date();
      const uploadDateString = `${dateNow.getUTCFullYear()}-${dateNow.getUTCMonth()}-${dateNow.getUTCDate()}`;
      const hashData = removeTimestamps({
        retailerId: input.retailerInstance.id,
        itemName: input.createRetailerItemPayload.name,
        baseUnit: input.baseUnit.id,
        uploadDateString,
      });
      const entityHash = hashObjectSha1(hashData);

      const retailerItem = await this.getOrCreateRetailerItem(
        createRetailerItemPayload,
        entityHash
      );

      const { channelItemRequests: finalChannelItemRequests, createdPackages } =
        await this.processPackages(
          packagingOptions,
          baseUnit,
          retailerItem,
          retailerInstance,
          userInstance,
          suppliers,
          new Map<string, string[]>(
            Object.entries(possibleIntegratedSupplierUnitsMap)
          ),
          locations,
          allRetailerChannels,
          entityHash
        );

      if (this.entityInventoryItem) {
        await this.retailerItemAdapter.setInventoryItem(
          this.entityInventoryItem
        );
      }

      if (finalChannelItemRequests.length) {
        this.logger.log('before getChannelItemsByHash');

        const { data: existingChannelItems }: GetChannelItemsResponse =
          await this.channelItemAdapter.getChannelItemsByHash(entityHash);
        this.logger.log('after getChannelItemsByHash');

        const remainingChannelItems: CreateChannelItemPayload[] =
          finalChannelItemRequests
            .filter(
              (channelItem) =>
                !existingChannelItems.some(
                  (existingChannelItem) =>
                    channelItem.retailerItem.id ===
                      existingChannelItem.retailerItem.id &&
                    channelItem.packaging.id ===
                      existingChannelItem.packaging.id &&
                    channelItem.supplierItem.id ===
                      existingChannelItem.supplierItem.id &&
                    channelItem.channel.id === existingChannelItem.channel.id
                )
            )
            .map((channelItem) => {
              return {
                ...channelItem,
                metadata: {
                  ...channelItem.metadata,
                  bulkUpload: { hash: entityHash },
                },
              };
            });

        if (remainingChannelItems.length === 0) {
          this.logger.log('Skipping channel items creation (already exists)');
        } else {
          await this.channelItemAdapter.createChannelItems({
            items: remainingChannelItems,
          });
        }
      }
      this.logger.log('--------------Single Entity End----------------');

      return { packages: createdPackages };
    } catch (err) {
      this.logger.error((err as Error).message, (err as Error).stack);

      throw err;
    }
  }

  private async processPackages(
    packageRequests: PackagingWithChildrenInput[],
    baseUnit: Uom,
    retailerItem: RetailerItemResponse,
    retailerInstance: SimpleEntity,
    userInstance: SimpleUser,
    suppliers: Supplier[],
    possibleIntegratedSupplierUnitsMap: Map<string, string[]>,
    locations: Branch[],
    channels: GetChannelResponse[],
    entityHash: string,
    level: 0 | 1 | 2 = 0,
    parentPackaging?: Packaging,
    basePackaging?: Packaging
  ): Promise<{
    channelItemRequests: CreateChannelItemPayload[];
    createdPackages: Packaging[];
  }> {
    let finalChannelItemRequests: CreateChannelItemPayload[] = [];
    let finalCreatedPackages: Packaging[] = [];
    this.logger.log('process packages');

    for (const packageRequest of packageRequests) {
      const newPackageResponse = await this.createPackaging(
        packageRequest,
        baseUnit,
        retailerItem,
        retailerInstance,
        userInstance,
        suppliers,
        possibleIntegratedSupplierUnitsMap,
        locations,
        channels,
        entityHash,
        level,
        parentPackaging,
        basePackaging
      );
      finalChannelItemRequests.push(...newPackageResponse.channelItemRequests);
      finalCreatedPackages.push(newPackageResponse.packaging);

      if (packageRequest.children?.length && level <= 2) {
        const {
          channelItemRequests: childrenItemRequests,
          createdPackages: childrenCreatedPackages,
        } = await this.processPackages(
          packageRequest.children,
          baseUnit,
          retailerItem,
          retailerInstance,
          userInstance,
          suppliers,
          possibleIntegratedSupplierUnitsMap,
          locations,
          channels,
          entityHash,
          (level + 1) as 1 | 2,
          newPackageResponse.packaging,
          basePackaging ?? newPackageResponse.packaging
        );
        finalChannelItemRequests = [
          ...finalChannelItemRequests,
          ...childrenItemRequests,
        ];
        finalCreatedPackages = [
          ...finalCreatedPackages,
          ...childrenCreatedPackages,
        ];
      }
    }

    return {
      channelItemRequests: finalChannelItemRequests,
      createdPackages: finalCreatedPackages,
    };
  }

  private async createPackaging(
    packageRequest: PackagingWithChildrenInput,
    baseUnit: Uom,
    retailerItem: RetailerItemResponse,
    retailerInstance: SimpleEntity,
    userInstance: SimpleUser,
    suppliers: Supplier[],
    possibleIntegratedSupplierUnitsMap: Map<string, string[]>,
    locations: Branch[],
    channels: GetChannelResponse[],
    entityHash: string,
    level: 0 | 1 | 2 = 0,
    parentPackaging?: Packaging,
    basePackaging?: Packaging
  ): Promise<{
    packaging: Packaging;
    channelItemRequests: CreateChannelItemPayload[];
  }> {
    this.logger.log('creating packages');

    const packName =
      level === 2
        ? `${packageRequest.unitName ? `${packageRequest.unitName} ` : ''}(${
            packageRequest.quantity
          }x${parentPackaging.quantity.parent ?? 1}x${
            basePackaging.packageName
          })`
        : level === 1
        ? `${packageRequest.unitName ? `${packageRequest.unitName} ` : ''}(${
            packageRequest.quantity
          }x${parentPackaging.packageName})`
        : `${packageRequest.quantity}${baseUnit.name}${
            packageRequest.unitName ? ` ${packageRequest.unitName}` : ''
          }`;

    const createInventoryItemPayload: CreateInventoryItemPayload =
      plainToInstance(CreateInventoryItemPayload, {
        retailer: { id: retailerInstance.id, name: retailerInstance.name.en },
        retailerItem: {
          id: retailerItem.id,
          name: retailerItem.name,
          scope: retailerItem.scope,
          code: retailerItem.code,
          suppliers: retailerItem.suppliers,
          category: retailerItem.category,
          baseUnit,
        },
        createdBy: userInstance,
        locations: locations.map((location) => {
          return { location: { id: location.id } };
        }),
        costingMethod: 'purchase-order',
        notAffectCogs: false,
        metadata: { bulkUpload: { hash: entityHash } },
      } as CreateInventoryItemPayload);

    const createPackagingPayload: CreatePackagingPayload = plainToInstance(
      CreatePackagingPayload,
      {
        level,
        fullPackageName: `${retailerItem.name.en} ${packName}`,
        retailer: retailerInstance,
        baseUnit: baseUnit,
        createdBy: userInstance,
        updatedBy: userInstance,
        packageName: packName,
        source: {
          id: retailerItem.id,
          scope: PackagingSourceScopeEnum.Item,
        },
        ...(packageRequest.unitName
          ? { unitName: packageRequest.unitName }
          : {}),
        usedAsPiece: level === 0 ? packageRequest.usedAsPiece : false,
        quantity:
          level === 0
            ? {
                base: 1,
                baseUnit: packageRequest.quantity,
              }
            : {
                base:
                  packageRequest.quantity *
                  (parentPackaging?.quantity.base ?? 1),
                baseUnit:
                  packageRequest.quantity *
                  (parentPackaging?.quantity.baseUnit ?? 1),
                parent: packageRequest.quantity,
              },
        ...(parentPackaging ? { parent: { id: parentPackaging.id } } : {}),
        metadata: { bulkUpload: { hash: entityHash } },
      } as CreatePackagingPayload,
      { excludeExtraneousValues: true, exposeUnsetFields: false }
    );
    const packaging = await this.getOrCreatePackage(
      createPackagingPayload,
      entityHash
    );

    const inventoryItem = await this.getOrCreateInventoryItem(
      createInventoryItemPayload,
      entityHash,
      retailerItem,
      userInstance
    );

    let channelItemRequests: CreateChannelItemPayload[] = [];

    if (packageRequest.suppliers?.length) {
      channelItemRequests = await this.getPackagingSuppliers(
        retailerItem,
        packaging,
        baseUnit,
        packageRequest.suppliers,
        suppliers,
        possibleIntegratedSupplierUnitsMap,
        locations,
        channels,
        entityHash,
        inventoryItem,
        parentPackaging,
        basePackaging
      );
    }

    return {
      packaging,
      channelItemRequests: [...channelItemRequests],
    };
  }

  private async getPackagingSuppliers(
    retailerItem: RetailerItemResponse,
    packaging: Packaging,
    baseUnit: Uom,
    supplierRequests: PackagingSupplierInput[],
    suppliers: Supplier[],
    possibleIntegratedSupplierUnitsMap: Map<string, string[]>,
    locations: Branch[],
    channels: GetChannelResponse[],
    entityHash: string,
    inventoryItem?: InventoryItem,
    parentPackaging?: Packaging,
    basePackaging?: Packaging
  ): Promise<CreateChannelItemPayload[]> {
    const numPriority = supplierRequests.filter((req) => req.isPriority).length;

    const finalRequests: PackagingSupplierInput[] = [];

    /**
     * Check and fix single isPriority per Package
     */

    if (numPriority === 1) {
      finalRequests.push(...supplierRequests);
    } else {
      let isPrioritySet = false;

      for (const req of supplierRequests) {
        const isPriority: boolean =
          numPriority > 1 ? !isPrioritySet && req.isPriority : !isPrioritySet;

        if (isPriority) {
          isPrioritySet = true;
        }

        finalRequests.push({ ...req, isPriority });
      }
    }

    const channelItemRequests: CreateChannelItemPayload[] = [];

    for (const supplierRequest of finalRequests) {
      const foundSupplier = suppliers.find(
        (supp) =>
          supp.name.toLowerCase() === supplierRequest.supplierName.toLowerCase()
      );

      const isIntegratedSupplier = !!possibleIntegratedSupplierUnitsMap.get(
        foundSupplier.id
      );
      const invoiceUnitType: InvoiceUnitType =
        supplierRequest.invoiceUnit.toLowerCase() ===
        packaging.baseUnit.name.toLowerCase()
          ? InvoiceUnitType.Uom
          : InvoiceUnitType.Package;

      const thisInvoiceUnit: InvoiceUnit = this.getInvoiceUnit(
        supplierRequest.invoiceUnit,
        invoiceUnitType,
        packaging,
        baseUnit,
        possibleIntegratedSupplierUnitsMap.get(foundSupplier.id) ?? [],
        isIntegratedSupplier,
        parentPackaging,
        basePackaging
      );

      const newSuppItemRequest: CreateSupplierItemPayload = {
        name: supplierRequest.itemName,
        supplier: { id: foundSupplier.id },
        ...(supplierRequest.itemCode
          ? { metadata: { supplierItemCode: supplierRequest.itemCode } }
          : {}),
        invoiceUnit: thisInvoiceUnit,
        uom: baseUnit,
        creationSource: SupplierItemCreationSource.Admin,
        metadata: { bulkUpload: { hash: entityHash } },
      };

      const supplierItem = await this.getOrCreateSupplierItem(
        newSuppItemRequest,
        entityHash
      );

      const atomPrice =
        (supplierRequest.price ?? 0) /
        (supplierItem.invoiceUnit.conversionToAtom ?? 1);

      const calculatedItemPrice =
        atomPrice *
        (packaging.quantity.baseUnit ?? 1) *
        (packaging.baseUnit.conversionToAtom ?? 1);

      channelItemRequests.push(
        ...locations
          .filter(
            (location) => location.id !== foundSupplier.metadata?.warehouseId
          )
          .map((location) => {
            const foundChannel = channels.find(
              (channel) =>
                channel.parties.includes(foundSupplier.id) &&
                channel.parties.includes(location.id)
            );

            return {
              location: { id: location.id },
              channel: { id: foundChannel.id },
              name: {
                en: packaging.fullPackageName,
                ...(retailerItem.name.ar
                  ? { ar: `${retailerItem.name.ar} ${packaging.packageName}` }
                  : {}),
              },
              price: calculatedItemPrice,
              retailer: { id: retailerItem.retailer.id },
              supplier: {
                id: foundSupplier.id,
              },
              branch: { id: location.outlet.id },
              packaging: plainToInstance(PackagingDataPayload, packaging, {
                excludeExtraneousValues: true,
                exposeDefaultValues: false,
              }),
              retailerItem: { id: retailerItem.id },
              supplierItem: { id: supplierItem.id },
              ...(supplierRequest.itemCode
                ? { itemCode: supplierRequest.itemCode }
                : {}),
              uom: baseUnit,
              priority: supplierRequest.isPriority,
              inventoryItem: { id: inventoryItem.id },
            };
          })
      );
    }

    return channelItemRequests;
  }

  private getInvoiceUnit(
    name: string,
    type: InvoiceUnitType,
    packaging: Packaging,
    uom: Uom,
    possibleIntegratedSupplierUnits: string[],
    isIntegrated?: boolean,
    parentPackaging?: Packaging,
    basePackaging?: Packaging
  ): InvoiceUnit {
    let invoiceUnit: InvoiceUnit;

    if (type === InvoiceUnitType.Uom) {
      invoiceUnit = {
        name: uom.name,
        conversionToAtom: uom.conversionToAtom || 1,
        type: InvoiceUnitType.Uom,
        uom: { id: uom.id },
      };
    }

    if (type === InvoiceUnitType.Package) {
      if (isIntegrated) {
        const foundIntegratedUnit = possibleIntegratedSupplierUnits.find(
          (unit) => unit.toLowerCase() === name.toLowerCase()
        );
        invoiceUnit = {
          name: foundIntegratedUnit,
          conversionToAtom:
            packaging.quantity.baseUnit *
            (packaging.baseUnit.conversionToAtom || 1),
          type: InvoiceUnitType.Package,
          uom: { id: packaging.baseUnit.id },
          packaging: { id: packaging.id },
        };
      } else if (name.toLowerCase() === packaging.packageName.toLowerCase()) {
        invoiceUnit = {
          name: packaging.packageName,
          conversionToAtom:
            packaging.quantity.baseUnit *
            (packaging.baseUnit.conversionToAtom || 1),
          type: InvoiceUnitType.Package,
          uom: { id: packaging.baseUnit.id },
          packaging: { id: packaging.id },
        };
      } else {
        const foundUnitPackage =
          name.toLowerCase() === parentPackaging?.packageName
            ? parentPackaging
            : basePackaging;
        invoiceUnit = {
          name: foundUnitPackage.packageName,
          conversionToAtom:
            foundUnitPackage.quantity.baseUnit *
            (foundUnitPackage.baseUnit.conversionToAtom || 1),
          type: InvoiceUnitType.Package,
          uom: { id: foundUnitPackage.baseUnit.id },
          packaging: { id: foundUnitPackage.id },
        };
      }
    }

    return invoiceUnit;
  }

  private async getOrCreateRetailerItem(
    payload: CreateRetailerItemPayload,
    entityHash: string
  ): Promise<RetailerItemResponse> {
    this.logger.log('before getRetailerItemByHash ');

    const existingRetailerItem =
      await this.retailerItemAdapter.getRetailerItemByHash(entityHash);
    this.logger.log('after getRetailerItemByHash ');

    if (existingRetailerItem) {
      this.logger.log(
        'skipping Retailer Item creation (already exists)',
        existingRetailerItem.id
      );

      return existingRetailerItem;
    }

    const newRetailerItem = await this.retailerItemAdapter.createRetailerItem({
      ...payload,
      metadata: { bulkUpload: { hash: entityHash } },
    });
    this.logger.log('after createRetailerItem');

    return newRetailerItem;
  }

  private async getOrCreatePackage(
    payload: CreatePackagingPayload,
    entityHash: string
  ): Promise<Packaging> {
    this.logger.log('before getPackagingItemByHash');

    const existingPackaging = (
      await this.packagingItemAdapter.getPackagingItemsByHash(entityHash)
    ).find(
      (packaging) =>
        packaging.sources.some((source) => source.id === payload.source.id) &&
        packaging.fullPackageName === payload.fullPackageName
    );
    this.logger.log('after getPackagingItemByHash');

    if (existingPackaging) {
      this.logger.log('Skipping Package item creation (already exists)');

      return existingPackaging;
    }

    this.logger.log('before createPackagingItem');

    const newPackaging = (await this.packagingItemAdapter.createPackagingItem(
      payload
    )) as Packaging;
    this.logger.log('after createPackagingItem');

    return newPackaging;
  }

  private async getOrCreateInventoryItem(
    payload: CreateInventoryItemPayload,
    entityHash: string,
    retailerItem: RetailerItemResponse,
    userInstance: SimpleUser
  ): Promise<InventoryItem> {
    this.logger.log('before getInventoryItemByHash');

    const existingInventoryItem = (
      await this.inventoryItemAdapter.getInventoryItemsByHash(entityHash)
    ).find((item) => item.retailerItem.id === payload.retailerItem.id);
    this.logger.log('after getInventoryItemByHash');

    if (existingInventoryItem) {
      this.logger.log('Skipping inventory item creation (already exists)');
      this.entityInventoryItem = {
        id: retailerItem.id,
        inventoryItem: { id: existingInventoryItem.id },
        updatedBy: userInstance,
      };

      return existingInventoryItem;
    }
    this.logger.log('before createInventoryItem');

    const newInventoryItem =
      await this.inventoryItemAdapter.createInventoryItem(payload);
    this.logger.log('after createInventoryItem');

    this.entityInventoryItem = {
      id: retailerItem.id,
      inventoryItem: { id: newInventoryItem.id },
      updatedBy: userInstance,
    };

    return newInventoryItem;
  }

  private async getOrCreateSupplierItem(
    payload: CreateSupplierItemPayload,
    entityHash: string
  ): Promise<CreateSupplierItemResponse> {
    this.logger.log('before getSupplierItemByHash');

    const existingSupplierItem = (
      await this.supplierItemAdapter.getSupplierItemsByHash(entityHash)
    ).find(
      (item) =>
        item.supplier.id === payload.supplier.id &&
        item.invoiceUnit.uom?.id === payload.invoiceUnit.uom?.id &&
        item.invoiceUnit.packaging?.id === payload.invoiceUnit.packaging?.id
    );
    this.logger.log('after getSupplierItemByHash');

    if (existingSupplierItem) {
      this.logger.log('Skipping Supplier Item creation (already exists)');

      return existingSupplierItem;
    }
    this.logger.log('before createSupplierItem');

    const supplierItem = await this.supplierItemAdapter.createSupplierItem(
      payload
    );
    this.logger.log('after createSupplierItem');

    return supplierItem;
  }
}
