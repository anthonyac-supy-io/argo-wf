import { Test, TestingModule } from '@nestjs/testing';

import { UploadEntitiesInput } from '../dtos';
import { TestModule } from './test.module';
import { UploadEntitiesInteractor } from './upload-entities.interactor';

describe('UploadSingleEntityInteractor', () => {
  let testingModule: TestingModule;
  let interactor: UploadEntitiesInteractor;

  const userIdTest = '64f1b02ac96261be272bdd2a';
  const entitiesInputTest: UploadEntitiesInput = {
    retailer: {
      id: '64faf49c3fca06ff4f33a698',
    },
    items: [
      {
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
    ],
  };

  beforeAll(async () => {
    testingModule = await Test.createTestingModule(TestModule).compile();

    interactor = testingModule.get(UploadEntitiesInteractor);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
  describe('Failed validations', () => {
    it('Should throw an error if baseUnit is not Valid', async () => {
      const testInput: UploadEntitiesInput = {
        ...entitiesInputTest,
        items: [
          {
            ...entitiesInputTest.items[0],
            baseUnit: 'invalid',
          },
        ],
      };
      const { failedInputs } = await interactor.execute(testInput, userIdTest);
      expect(failedInputs.length === 1).toBeTruthy();
      expect(
        failedInputs[0].exception.message ===
          'The specified unit invalid does not exist'
      ).toBeTruthy();
    });
    it('Should throw an error if location is not Valid', async () => {
      const testInput: UploadEntitiesInput = {
        ...entitiesInputTest,
        items: [
          {
            ...entitiesInputTest.items[0],
            costCenter: 'invalid',
          },
        ],
      };
      const { failedInputs } = await interactor.execute(testInput, userIdTest);
      expect(failedInputs.length === 1).toBeTruthy();
      expect(
        failedInputs[0].exception.message ===
          'The location invalid does not exist in the selected Retailer'
      ).toBeTruthy();
    });
    it('Should throw an error if request supplier item pricing unit is not valid', async () => {
      const testInput: UploadEntitiesInput = {
        ...entitiesInputTest,
        items: [
          {
            ...entitiesInputTest.items[0],
            packagingOptions: [
              {
                ...entitiesInputTest.items[0].packagingOptions[0],
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
                      en: 'Best Cashewnuts 100 Kg Box',
                    },
                    itemCode: '1111',
                    invoiceUnit: 'invalid unit',
                    price: 200,
                    supplierName: 'ACS_Poultry Supplier',
                    isPriority: false,
                  },
                ],
              },
            ],
          },
        ],
      };
      const { failedInputs } = await interactor.execute(testInput, userIdTest);
      expect(failedInputs.length === 1).toBeTruthy();
      expect(
        failedInputs[0].exception.message ===
          'The pricing unit invalid unit is not valid for the item Abou Chacra test Item1x and the supplier-item Best Cashewnuts 100 Kg Box 1111 from supplier ACS_Poultry Supplier'
      ).toBeTruthy();
    });
    it('Should throw an error if supplier is an integrated supplier and pricing unit is not included in the integrated units', async () => {
      const testInput = {
        ...entitiesInputTest,
        items: [
          {
            ...entitiesInputTest.items[0],
            packagingOptions: entitiesInputTest.items[0].packagingOptions.map(
              (option) => ({
                ...option,
                suppliers: [
                  ...option.suppliers.map((supplier) => ({ ...supplier })),
                  {
                    itemName: {
                      en: 'Some Box',
                    },
                    itemCode: '123456264945',
                    invoiceUnit: 'invalid unit',
                    price: 10,
                    supplierName: 'INTEGRATED SUPPLIER',
                    isPriority: true,
                  },
                ],
              })
            ),
          },
        ],
      };
      const { failedInputs } = await interactor.execute(testInput, userIdTest);
      expect(failedInputs.length === 1).toBeTruthy();
      expect(
        failedInputs[0].exception.message ===
          'The pricing unit invalid unit is not valid for the item Abou Chacra test Item1x and the supplier-item Some Box 123456264945 from supplier INTEGRATED SUPPLIER'
      ).toBeTruthy();
    });
  });
});
