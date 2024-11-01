/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PreconditionFailedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { RetailerItemAdapter } from '../adapters';
import { UploadSingleEntityInput } from '../dtos';
import { TestModule } from './test.module';
import { UploadEntitiesInteractor } from './upload-entities.interactor';
import { UploadSingleEntityInteractor } from './upload-single-entity.interactor';

describe('UploadSingleEntityInteractor', () => {
  let testingModule: TestingModule;
  let interactor: UploadSingleEntityInteractor;

  const userIdTest = '64f1b02ac96261be272bdd2a';
  const singleEntityInputTest: UploadSingleEntityInput = {
    retailer: {
      id: '64faf49c3fca06ff4f33a698',
    },
    item: {
      code: '6ed0fb',
      name: {
        en: 'Abou Chacra test Item1x',
      },
      baseUnit: 'kg',
      category: {
        parentName: 'Food',
        childName: 'Protein',
      },
      packagingOptions: [
        {
          unitName: 'Box',
          quantity: 10,
          usedAsPiece: false,
          children: [
            {
              unitName: 'Container',
              quantity: 200,
              suppliers: [
                {
                  itemName: {
                    en: 'Best Cashewnuts 200 Kg Cnt',
                  },
                  itemCode: '11000',
                  invoiceUnit: 'Container (200x10kg Box)',
                  price: 50,
                  supplierName: 'ACS_Poultry Supplier',
                  isPriority: true,
                },
              ],
            },
          ],
          suppliers: [
            {
              itemName: {
                en: 'Joseph Apple Box',
              },
              itemCode: '123456',
              invoiceUnit: 'kg',
              price: 10,
              supplierName: 'ACS_Poultry Supplier',
              isPriority: true,
            },
            {
              itemName: {
                en: 'Best Cashewnuts 10 Kg Box',
              },
              itemCode: '1111',
              invoiceUnit: '10kg Box',
              price: 200,
              supplierName: 'ACS_Poultry Supplier',
              isPriority: false,
            },
          ],
        },
      ],
    },
  };

  beforeAll(async () => {
    testingModule = await Test.createTestingModule(TestModule).compile();

    interactor = testingModule.get(UploadSingleEntityInteractor);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('Should call RetailerItemAdapter.createRetailerItems always', async () => {
    const testInput = await testingModule
      .get(UploadEntitiesInteractor)
      .validateInputAndGetData(singleEntityInputTest, userIdTest);
    const retailerItemAdapter = testingModule.get(RetailerItemAdapter);
    await interactor.execute(testInput);
    expect(retailerItemAdapter.createRetailerItem).toHaveBeenCalledTimes(1);
  });

  it('All pricing unit requests should match one of the packages or the base unit', () => {
    const extractedPackageUnits: string[] = [
      ...singleEntityInputTest.item.packagingOptions.flatMap((pack) => [
        ...(pack.children?.flatMap(
          (pack) => pack.suppliers?.map((supp) => supp.invoiceUnit) ?? []
        ) ?? []),
      ]),
    ];
    const extractedSupplierRequestsUnits: string[] = [
      ...singleEntityInputTest.item.packagingOptions.flatMap((pack) => [
        ...(pack.suppliers?.map((supp) => supp.invoiceUnit) ?? []),
      ]),
    ];
    extractedPackageUnits.map((packUnit) => {
      extractedSupplierRequestsUnits.map((supUnit) => {
        expect(
          packUnit.includes(supUnit) ||
            supUnit === singleEntityInputTest.item.baseUnit
        ).toBeTruthy();
      });
    });
  });
  describe('Requested base unit is Piece', () => {
    it('There should be only one level-0 package, with quantity 1', async () => {
      const testInput: UploadSingleEntityInput = {
        ...singleEntityInputTest,
        item: {
          ...singleEntityInputTest.item,
          baseUnit: 'Piece',
          packagingOptions: [],
        },
      };
        const testSingleEntityInput = await testingModule
          .get(UploadEntitiesInteractor)
          .validateInputAndGetData(testInput, userIdTest);
      const { packages } = await interactor.execute(testSingleEntityInput);
      const lvl0Packages = packages.filter((pack) => pack.level === 0);
      expect(
        lvl0Packages.length === 1 && lvl0Packages[0].quantity.base === 1
      ).toBeTruthy();
    });
    it('Should use 1piece package at level-0 and level up the remaining packages', async () => {
      const testInput: UploadSingleEntityInput = {
        ...singleEntityInputTest,
        item: {
          ...singleEntityInputTest.item,
          baseUnit: 'Piece',
          packagingOptions: [
            ...singleEntityInputTest.item.packagingOptions.map((option) => ({
              ...option,
              suppliers: [
                ...option.suppliers.map((supplier) => ({
                  ...supplier,
                  invoiceUnit: supplier.invoiceUnit
                    .replace('10kg Box', 'box (10x1piece)')
                    .replace('kg', 'piece'),
                })),
              ],
              children: [
                ...option.children.map((child) => ({
                  ...child,
                  suppliers: [
                    ...child.suppliers.map((supplier) => ({
                      ...supplier,
                      invoiceUnit: supplier.invoiceUnit
                        .replace(
                          'Container (200x10kg Box)',
                          'container (200x10x1piece)'
                        )
                        .replace('kg', 'piece'),
                    })),
                  ],
                })),
              ],
            })),
            {
              quantity: 1,
              unitName: '1Piece',
            },
          ],
        },
      };
      const testSingleEntityInput = await testingModule
        .get(UploadEntitiesInteractor)
        .validateInputAndGetData(testInput, userIdTest);
      const { packages } = await interactor.execute(testSingleEntityInput);
      const lvl0Packages = packages.filter((pack) => pack.level === 0);
      expect(
        lvl0Packages.length === 1 && lvl0Packages[0].unitName === '1Piece'
      ).toBeTruthy();
    });
    it('Should create 1piece package at level-0 and level up the remaining packages', async () => {
      const testInput: UploadSingleEntityInput = {
        ...singleEntityInputTest,
        item: {
          ...singleEntityInputTest.item,
          baseUnit: 'Piece',
          packagingOptions: [
            ...singleEntityInputTest.item.packagingOptions.map((option) => ({
              ...option,
              suppliers: [
                ...option.suppliers.map((supplier) => ({
                  ...supplier,
                  invoiceUnit: supplier.invoiceUnit
                    .replace('10kg Box', 'box (10x1piece)')
                    .replace('kg', 'piece'),
                })),
              ],
              children: [
                ...option.children.map((child) => ({
                  ...child,
                  suppliers: [
                    ...child.suppliers.map((supplier) => ({
                      ...supplier,
                      invoiceUnit: supplier.invoiceUnit
                        .replace(
                          'Container (200x10kg Box)',
                          'container (200x10x1piece)'
                        )
                        .replace('kg', 'piece'),
                    })),
                  ],
                })),
              ],
            })),
          ],
        },
      };
      const testSingleEntityInput = await testingModule
        .get(UploadEntitiesInteractor)
        .validateInputAndGetData(testInput, userIdTest);
      const { packages } = await interactor.execute(testSingleEntityInput);
      const lvl0Packages = packages.filter((pack) => pack.level === 0);
      expect(
        lvl0Packages.length === 1 && lvl0Packages[0].packageName === '1Piece'
      ).toBeTruthy();
    });
  });
});
