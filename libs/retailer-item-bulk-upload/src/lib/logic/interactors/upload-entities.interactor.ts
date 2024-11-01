import { plainToInstance } from 'class-transformer';
import * as fs from 'fs';
import {
  Injectable,
  Logger,
  PreconditionFailedException,
} from '@nestjs/common';

import { RedisClusterService } from '@supy.api/redis';

import {
  Branch,
  BulkUploadCache,
  ItemScopeTypeEnum,
  RetailerItemCategory,
  Supplier,
  SupplierPartnershipTypeEnum,
  Uom,
  writeLargeArrayToStream,
} from '../../common';
import { IdPayload, SimpleEntity, SimpleUser } from '../../core';
import {
  BranchAdapter,
  ChannelAdapter,
  CreateRetailerItemPayload,
  GetChannelResponse,
  GetRetailerResponse,
  GetUserResponse,
  RetailerAdapter,
  RetailerItemCategoryAdapter,
  SupplierAdapter,
  UomAdapter,
  UserAdapter,
} from '../adapters';
import {
  PackagingWithChildrenInput,
  SingleEntity,
  UploadEntitiesInput,
  UploadSingleEntityInput,
} from '../dtos';

interface FailedInputs {
  item: UploadEntitiesInput['items'][0];
  exception: PreconditionFailedException;
}
interface UploadEntitiesResponse {
  failedInputs: FailedInputs[];
  singleEntities: string[];
}
interface UploadItemValidationData {
  uoms: Uom[];
  categories: RetailerItemCategory[];
  locations: Branch[];
  retailer: GetRetailerResponse;
  allRetailerChannels: GetChannelResponse[];
  user: GetUserResponse;
}
const __dir = `/workflow/output`;
const path = `${__dir}/successful-items.json`;
const pathCount = `${__dir}/successful-items-count`;
const failedPath = `${__dir}/failed-items.json`;
const failedPathCount = `${__dir}/failed-items-count`;

@Injectable()
export class UploadEntitiesInteractor {
  private readonly logger = new Logger(UploadEntitiesInteractor.name);

  constructor(
    private readonly retailerAdapter: RetailerAdapter,
    private readonly retailerItemCategoryAdapter: RetailerItemCategoryAdapter,
    private readonly branchAdapter: BranchAdapter,
    private readonly supplierAdapter: SupplierAdapter,
    private readonly uomAdapter: UomAdapter,
    private readonly userAdapter: UserAdapter,
    private readonly channelAdapter: ChannelAdapter,
    private readonly redisClusterService: RedisClusterService
  ) {}

  async execute(
    retailerId: string,
    userId: string
  ): Promise<UploadEntitiesResponse> {
    this.logger.log('---------STEP 1 START---------');

    const failedInputs: FailedInputs[] = [];
    const singleEntities: string[] = [];
    fs.writeFileSync(path, '[]');
    fs.writeFileSync(failedPath, '[]');
    fs.writeFileSync(pathCount, '0');
    fs.writeFileSync(failedPathCount, '0');

    this.logger.log('Initialized files');

    const redisResponse = await this.redisClusterService.get(
      `retailer-items:upload:${retailerId}`
    );

    if (!redisResponse) {
      throw new Error('Could Not Fetch Data From Redis');
    }
    this.logger.log('after redis data fetching');

    const { items } = JSON.parse(redisResponse as string) as BulkUploadCache;
    this.logger.log('after parsing redisResponse');

    if (items.length) {
      const validationData = await this.getValidationData(
        { id: retailerId },
        userId
      );

      for (const [index, item] of items.entries()) {
        try {
          const singleEntity = await this.validateInputAndPreparePayload(
            { item, retailer: { id: retailerId } },
            validationData
          );
          const singleEntityPath = `${__dir}/singleEntity${index}.json`;
          singleEntities.push(singleEntityPath);
          fs.writeFileSync(singleEntityPath, JSON.stringify(singleEntity));
        } catch (exception) {
          this.logger.error(
            (exception as Error).message,
            (exception as Error).stack
          );

          throw exception;
        }
      }
    }
    this.logger.log('validated entities');

    if (singleEntities.length) {
      await writeLargeArrayToStream<string>(singleEntities, path);
    }

    this.logger.log('first entity:', JSON.stringify(singleEntities[0]));

    if (failedInputs.length) {
      await writeLargeArrayToStream<FailedInputs>(failedInputs, failedPath);
    }
    this.logger.log('first failed inputs:', JSON.stringify(failedInputs[0]));

    fs.writeFileSync(pathCount, singleEntities.length.toString());
    fs.writeFileSync(failedPathCount, failedInputs.length.toString());
    this.logger.log('---------STEP 1 END---------');

    return {
      singleEntities,
      failedInputs,
    };
  }

  async getValidationData(
    retailerId: IdPayload,
    userId: string
  ): Promise<UploadItemValidationData> {
    this.logger.log('before fetching data');

    const [
      retailer,
      { data: categories },
      { data: locations },
      { data: uoms },
      user,
    ] = await Promise.all([
      this.retailerAdapter.getRetailerById(retailerId),
      this.retailerItemCategoryAdapter.getRetailerItemCategoriesByRetailerId(
        retailerId.id
      ),
      this.branchAdapter.getBranchesByRetailerId(retailerId.id), //location
      this.uomAdapter.getUoms(),
      this.userAdapter.getUserById({ id: userId }),
    ]);
    const { data: allRetailerChannels } =
      await this.channelAdapter.getChannelsByLocationIds(
        locations.map((loc) => loc.id)
      );
    this.logger.log('after fetching data');

    return {
      uoms,
      categories,
      locations,
      retailer,
      allRetailerChannels,
      user,
    };
  }

  async validateInputAndPreparePayload(
    input: UploadSingleEntityInput,
    data: UploadItemValidationData
  ): Promise<SingleEntity> {
    const supplierNames = [
      ...input.item.packagingOptions.flatMap((pack) => [
        ...(pack.suppliers?.map((supp) => supp.supplierName) ?? []),
        ...(pack.children?.flatMap(
          (pack) => pack.suppliers?.map((supp) => supp.supplierName) ?? []
        ) ?? []),
      ]),
    ];
    const { uoms, categories, locations, retailer, allRetailerChannels, user } =
      data;

    this.logger.log('before fetching suppliers');

    const [{ data: allNamedSuppliers }] = await Promise.all([
      this.supplierAdapter.getSuppliersByName(supplierNames),
    ]);
    this.logger.log('after fetching suppliers');

    const suppliers: Supplier[] = allNamedSuppliers.filter((supplier) =>
      allRetailerChannels.some((channel) =>
        channel.parties.includes(supplier.id)
      )
    );
    const retailerInstance = plainToInstance(
      SimpleEntity,
      { ...retailer, name: { en: retailer.name } },
      { excludeExtraneousValues: true }
    );

    const userInstance = plainToInstance(SimpleUser, user, {
      excludeExtraneousValues: true,
    });
    const nestedCategories = categories.reduce<
      (RetailerItemCategory & { parent: SimpleEntity })[]
    >((acc, cat) => {
      if (cat.parent) {
        acc.push({
          ...cat,
          parent: {
            ...cat.parent,
            name: categories.find((pCat) => pCat.id === cat.parent.id)?.name,
          },
        });
      }

      return acc;
    }, []);

    /**
     * Validations for sheet data
     */

    if (
      !uoms.some(
        (unit) => unit.name.toLowerCase() === input.item.baseUnit.toLowerCase()
      )
    ) {
      throw new PreconditionFailedException(
        `The specified unit ${input.item.baseUnit} does not exist`
      );
    }

    if (
      input.item.costCenter &&
      !locations.some(
        (loc) => loc.name.toLowerCase() === input.item.costCenter.toLowerCase()
      )
    ) {
      throw new PreconditionFailedException(
        `The location ${input.item.costCenter} does not exist in the selected Retailer`
      );
    }

    supplierNames.forEach((suppName) => {
      if (
        !suppliers.some(
          (loc) => loc.name.toLowerCase() === suppName.toLowerCase()
        )
      ) {
        throw new PreconditionFailedException(
          `The supplier ${suppName} does not exist or is not linked to this Retailer`
        );
      }
    });

    locations.map((location) => {
      suppliers.map((supplier) => {
        if (supplier.metadata?.warehouseId === location.id) {
          return;
        }

        const foundChannel = allRetailerChannels.some(
          (channel) =>
            channel.parties.includes(supplier.id) &&
            channel.parties.includes(location.id)
        );

        if (!foundChannel) {
          throw new PreconditionFailedException(
            `The location ${location.name} does not have an active channel with the supplier ${supplier.name}`
          );
        }
      });
    });

    //TODO: rework to have custom units per integrated supplier - 31.03.2023
    const possibleIntegratedSupplierUnitsMap: Map<string, string[]> = new Map();
    suppliers.forEach((supp) => {
      if (
        supp.metadata?.partnershipType ===
        SupplierPartnershipTypeEnum.Integrated
      ) {
        const integratedUnits =
          supp.metadata?.integratedUnits?.map((unit) => unit.name) ?? [];
        possibleIntegratedSupplierUnitsMap.set(supp.id, integratedUnits);
      }
    });

    if (input.item.category) {
      const foundCategory = nestedCategories.some(
        (nCat) =>
          nCat.name.en.toLowerCase() ===
            input.item.category.childName.toLowerCase() &&
          nCat.parent.name.en.toLowerCase() ===
            input.item.category.parentName.toLowerCase()
      );

      if (!foundCategory) {
        throw new PreconditionFailedException(
          `The category ${input.item.category.parentName} with sub-category ${input.item.category.childName} does not exist in the selected Retailer`
        );
      }
    }

    const possibleUnits: string[] = [];

    const foundUom = uoms.find(
      (unit) => unit.name.toLowerCase() === input.item.baseUnit.toLowerCase()
    );
    possibleUnits.push(foundUom.name.toLowerCase());

    input.item.packagingOptions.forEach((pack) => {
      const isOverriddenPackage = !!(foundUom.isPiece && pack.quantity !== 1);

      const basePackName = isOverriddenPackage
        ? `${pack.unitName ? `${pack.unitName} ` : ''}(${pack.quantity}x1Piece)`
        : `${pack.quantity}${foundUom.name}${
            pack.unitName ? ` ${pack.unitName}` : ''
          }`;
      possibleUnits.push(basePackName.toLowerCase());

      if (pack.children) {
        pack.children.map((childPack) => {
          const childPackName = isOverriddenPackage
            ? `${childPack.unitName ? `${childPack.unitName} ` : ``}(${
                childPack.quantity
              }x${pack.quantity}x1Piece)`
            : `${childPack.unitName ? `${childPack.unitName} ` : ``}(${
                childPack.quantity
              }x${basePackName})`;
          possibleUnits.push(childPackName.toLowerCase());
        });
      }
    });

    input.item.packagingOptions
      .flatMap((pack) => [
        ...(pack.suppliers ?? []),
        ...(pack.children?.flatMap((pack) => pack.suppliers ?? []) ?? []),
      ])
      .forEach((suppRequest) => {
        const foundSupplier = suppliers.find(
          (supp) =>
            supp.name.toLowerCase() === suppRequest.supplierName.toLowerCase()
        );

        const integratedUnitResp = possibleIntegratedSupplierUnitsMap.get(
          foundSupplier.id
        );

        const integratedUnits = integratedUnitResp ?? [];

        const isIntegratedSupplier = !!integratedUnitResp;

        if (isIntegratedSupplier && !suppRequest.itemCode) {
          throw new PreconditionFailedException(
            `Invalid or missing Supplier Item Code for the item ${input.item.name.en} from Integrated Supplier ${suppRequest.supplierName}`
          );
        }

        if (
          (isIntegratedSupplier &&
            !integratedUnits
              .map((unit) => unit.toLowerCase())
              .includes(suppRequest.invoiceUnit.toLowerCase())) ||
          (!isIntegratedSupplier &&
            !possibleUnits.includes(suppRequest.invoiceUnit.toLowerCase()))
        ) {
          throw new PreconditionFailedException(
            `The pricing unit ${
              suppRequest.invoiceUnit
            } is not valid for the item ${
              input.item.name.en
            } and the supplier-item ${suppRequest.itemName.en} ${
              suppRequest.itemCode
            } from ${
              possibleIntegratedSupplierUnitsMap.get(foundSupplier.id)
                ? 'Integrated '
                : ''
            }supplier ${suppRequest.supplierName}`
          );
        }
      });

    const baseUnit = uoms.find(
      (unit) => unit.name.toLowerCase() === input.item.baseUnit.toLowerCase()
    );
    const foundCategory = input.item.category
      ? nestedCategories.find(
          (nCat) =>
            nCat.name.en.toLowerCase() ===
              input.item.category.childName.toLowerCase() &&
            nCat.parent.name.en.toLowerCase() ===
              input.item.category.parentName.toLowerCase()
        )
      : undefined;
    const categoryInstance = input.item.category
      ? plainToInstance(SimpleEntity, foundCategory, {
          excludeExtraneousValues: true,
          exposeUnsetFields: false,
        })
      : undefined;
    const itemSupplierLowercaseNames = input.item.packagingOptions.flatMap(
      (pack) => [
        ...(pack.suppliers?.map((supp) => supp.supplierName.toLowerCase()) ??
          []),
        ...(pack.children?.flatMap(
          (pack) =>
            pack.suppliers?.map((supp) => supp.supplierName.toLowerCase()) ?? []
        ) ?? []),
      ]
    );
    const itemSuppliers = suppliers.filter((supp) =>
      itemSupplierLowercaseNames.includes(supp.name.toLowerCase())
    );
    const createRetailerItemPayload: CreateRetailerItemPayload =
      plainToInstance(
        CreateRetailerItemPayload,
        {
          ...input.item,
          scope: {
            type: ItemScopeTypeEnum.Item,
          },
          locations: locations.map((loc) => ({ id: loc.id })),
          createdBy: userInstance,
          updatedBy: userInstance,
          ...(categoryInstance ? { category: categoryInstance } : {}),
          retailer: retailerInstance,
          metadata: {
            hasChannelItemsOnCreation: true,
          },
          suppliers: itemSuppliers.map((supp) => ({ id: supp.id })),
        } as CreateRetailerItemPayload,
        { excludeExtraneousValues: true, exposeUnsetFields: false }
      );
    const finalPackagingOptions: PackagingWithChildrenInput[] = [];

    if (baseUnit.isPiece) {
      /**
       * Check and fix piece packaging to have just one pipeline
       */

      const potentialBasePackages = input.item.packagingOptions.filter(
        (pack) => pack.quantity === 1
      );
      const remainingPackages = input.item.packagingOptions.filter(
        (pack) => pack.quantity !== 1
      );

      let finalBasePackage: PackagingWithChildrenInput;

      if (potentialBasePackages.length > 1) {
        finalBasePackage = {
          ...potentialBasePackages[0],
          usedAsPiece: true,
          children: [],
          suppliers: [],
        };

        for (const basePackageOption of potentialBasePackages) {
          finalBasePackage.children.push(
            ...(basePackageOption.children?.map((packRequest) => ({
              ...packRequest,
              usedAsPiece: false,
            })) ?? [])
          );
          finalBasePackage.suppliers.push(
            ...(basePackageOption.suppliers ?? [])
          );
        }
      } else if (potentialBasePackages.length === 1) {
        finalBasePackage = {
          ...potentialBasePackages[0],
          ...(!potentialBasePackages[0].children?.length
            ? { children: [] }
            : {}),
          ...(!potentialBasePackages[0].suppliers?.length
            ? { suppliers: [] }
            : {}),
          usedAsPiece: true,
        };
      } else {
        finalBasePackage = {
          quantity: 1,
          children: [],
          suppliers: [],
          usedAsPiece: true,
        };
      }

      finalBasePackage.children.push(...remainingPackages);
      finalPackagingOptions.push(finalBasePackage);
    } else {
      /**
       * Check and fix max one usedAsPiece package per base item
       */
      const numPiece = input.item.packagingOptions.filter(
        (req) => req.usedAsPiece
      ).length;

      if (numPiece > 1) {
        let isPieceSet = false;

        for (const req of input.item.packagingOptions) {
          const usedAsPiece: boolean = !isPieceSet && req.usedAsPiece;

          if (usedAsPiece) {
            isPieceSet = true;
          }

          finalPackagingOptions.push({ ...req, usedAsPiece });
        }
      } else {
        finalPackagingOptions.push(...input.item.packagingOptions);
      }
    }
    this.logger.log('finished validating payload');

    return {
      locations,
      userInstance,
      retailerInstance,
      baseUnit,
      suppliers,
      possibleIntegratedSupplierUnitsMap: Object.fromEntries(
        possibleIntegratedSupplierUnitsMap
      ),
      allRetailerChannels,
      createRetailerItemPayload,
      packagingOptions: finalPackagingOptions,
    };
  }
}
