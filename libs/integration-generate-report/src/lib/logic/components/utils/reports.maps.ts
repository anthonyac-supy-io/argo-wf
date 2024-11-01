import { FillPattern } from '@dima-supy-io/exceljs';

import {
  AllReportType,
  InventoryReportTypeEnum,
  ProcurementReportTypeEnum,
  SalesReportTypeEnum,
} from '../../../common';
import {
  ExtraColumns,
  GenerateReportOutputProps,
  ReportColumns,
  ReportDetailsOptions,
  WorkSheetProps,
} from './reports.type';

export const reportsDetailsOptionsMap = new Map<
  AllReportType,
  ReportDetailsOptions
>([
  //---------------------------------Inventory-----------------------------------
  [
    InventoryReportTypeEnum.BranchRecipeListing,
    {
      hideSupplierAndCategory: true,
      dateSelectionType: 'none',
    },
  ],
  [
    InventoryReportTypeEnum.RecipeListing,
    {
      hideSupplierAndCategory: true,
      dateSelectionType: 'none',
    },
  ],
  [
    InventoryReportTypeEnum.StockValue,
    {
      hideSupplierAndCategory: true,
      dateSelectionType: 'single',
    },
  ],
  [
    InventoryReportTypeEnum.Variance,
    {
      hideSupplierAndCategory: true,
      dateSelectionType: 'single',
    },
  ],
  //---------------------------------Procurement-------------------------------------
  [ProcurementReportTypeEnum.AllPurchases, {}],
  [ProcurementReportTypeEnum.Invoices, {}],
  [ProcurementReportTypeEnum.ItemsBySupplier, {}],
  [ProcurementReportTypeEnum.ItemsByPriceChanges, {}],
  [ProcurementReportTypeEnum.Items, {}],
  [ProcurementReportTypeEnum.Orders, {}],
  [ProcurementReportTypeEnum.PurchaseValue, {}],
  [ProcurementReportTypeEnum.SupplierStatement, {}],
  [ProcurementReportTypeEnum.Suppliers, {}],
  [ProcurementReportTypeEnum.CentralKitchen, {}],
  [
    ProcurementReportTypeEnum.CentralKitchenB2B,
    {
      showCustomers: true,
    },
  ],
  //---------------------------------Cogs--------------------------------------------
]);

export const reportColumnsMap = new Map<AllReportType, ReportColumns>([
  //----------------------------------Inventory--------------------------------------
  [
    InventoryReportTypeEnum.BranchRecipeListing,
    {
      qtyColumns: new Set<string>(['portionSize', 'netQty', 'grossQty']),
      priceColumns: new Set<string>([
        'recipeCost',
        'foodCostPercentage',
        'sellingPrice',
        'recipeCost',
        'netSellingPrice',
        'prepWastagePercentage',
        'lastPurchaseCost',
        'ingredientCost',
      ]),
    },
  ],
  [
    InventoryReportTypeEnum.ItemActivity,
    {
      qtyColumns: new Set<string>(['eventQty', 'qtyAfter']),
      priceColumns: new Set<string>([
        'eventValue',
        'newItemCost',
        'valueAfter',
      ]),
    },
  ],
  [
    InventoryReportTypeEnum.Production,
    {
      qtyColumns: new Set<string>(['totalQty', 'ingredientQty']),
      priceColumns: new Set<string>(['totalValue', 'ingredientValue']),
    },
  ],
  [
    InventoryReportTypeEnum.RecipeListing,
    {
      qtyColumns: new Set<string>(['portionSize', 'netQty', 'grossQty']),
      priceColumns: new Set<string>([
        'recipeCost',
        'foodCostPercentage',
        'sellingPrice',
        'recipePrice',
        'netSellingPrice',
        'prepWastagePercentage',
        'lastPurchaseCost',
      ]),
    },
  ],
  [
    InventoryReportTypeEnum.StockMovementBetweenCounts,
    {
      qtyColumns: new Set<string>([
        'openingStockQty',
        'receivedQty',
        'productionInQty',
        'transferInQty',
        'cogsFromSalesQty',
        'productionOutQty',
        'transferOutQty',
        'wastedQty',
        'actualClosingStockQty',
        'uncontrolledStockQty',
        'shippedOutQty',
        'qtyChange',
      ]),
      priceColumns: new Set<string>([
        'openingStockValue',
        'purchaseValue',
        'productionInValue',
        'transferInValue',
        'mergedInValue',
        'cogsFromSalesValue',
        'productionOutValue',
        'transferOutValue',
        'shippedOutValue',
        'mergedOutValue',
        'wastedValue',
        'receivedValue',
        'productionInValue',
        'transferInValue',
        'cogsFromSalesValue',
        'productionOutValue',
        'transferOutValue',
        'wastedValue',
        'actualClosingStockValue',
        'uncontrolledStockValue',
        'valueChange',
        'avgItemCost',
      ]),
      dateColumns: new Set<string>(['lastCountedDate', 'date']),
    },
  ],
  [
    InventoryReportTypeEnum.StockMovements,
    {
      qtyColumns: new Set<string>([
        'receivedQty',
        'productionInQty',
        'transferInQty',
        'cogsFromSalesQty',
        'productionOutQty',
        'transferOutQty',
        'wastedQty',
        'uncontrolledStockQty',
        'qtyChange',
        'shippedOutQty',
      ]),
      priceColumns: new Set<string>([
        'receivedValue',
        'productionInValue',
        'transferInValue',
        'cogsFromSalesValue',
        'productionOutValue',
        'transferOutValue',
        'wastedValue',
        'uncontrolledStockValue',
        'valueChange',
        'shippedOutValue',
      ]),
      dateColumns: new Set<string>(['lastCountedDate', 'date']),
    },
  ],
  [
    InventoryReportTypeEnum.StockValue,
    {
      qtyColumns: new Set<string>(['stockQty']),
      priceColumns: new Set<string>(['stockValue', 'costPerUnit']),
      dateColumns: new Set<string>(['latestEventDate', 'effectiveDate']),
    },
  ],
  [
    InventoryReportTypeEnum.Transfer,
    {
      qtyColumns: new Set<string>(['QTY']),
      priceColumns: new Set<string>([
        'transferValue',
        'totalTransferValue',
        'transferOutValue',
        'transferInValue',
      ]),
      dateColumns: new Set<string>(['eventDate']),
    },
  ],
  [
    InventoryReportTypeEnum.Variance,
    {
      qtyColumns: new Set<string>(['onHandQty', 'countedQty', 'qtyVariance']),
      priceColumns: new Set<string>([
        'onHandValue',
        'countedValue',
        'valueVariance',
      ]),
      dateColumns: new Set<string>(['lastCountedDate']),
    },
  ],
  [
    InventoryReportTypeEnum.Wastage,
    {
      qtyColumns: new Set<string>(['qty', 'wastedQty']),
      priceColumns: new Set<string>([
        'COGSWastageValue',
        'expenseWastageValue',
        'proratedLimit',
        'costVsLimitPercent',
        'totalWastageValue',
        'wastageValue',
      ]),
      dateColumns: new Set<string>(['eventDate', 'date']),
    },
  ],
  //-------------------------------------Procurement----------------------------------
  [
    ProcurementReportTypeEnum.AllPurchases,
    {
      qtyColumns: new Set<string>(['receivedQty', 'documentQty']),
      priceColumns: new Set<string>([
        'expectedPrice',
        'invoicePrice',
        'subTotal',
        'taxAmount',
        'total',
        'invoiceDiscount',
        'otherFees',
        'grandTotal',
        'totalItemDiscount',
        'totalFOCValue',
      ]),
      dateColumns: new Set<string>(['documentDate', 'bookingDate']),
    },
  ],
  [
    ProcurementReportTypeEnum.Invoices,
    {
      priceColumns: new Set<string>([
        'purchasedValuePreTax',
        'taxAmount',
        'purchasedValuePostTax',
        'invoiceDiscount',
        'otherFees',
        'grandTotal',
        'totalItemDiscount',
        'totalFOCValue',
      ]),
      dateColumns: new Set<string>([
        'invoiceDate',
        'bookingDate',
        'paymentDate',
      ]),
    },
  ],
  [
    ProcurementReportTypeEnum.ItemsBySupplier,
    {
      qtyColumns: new Set<string>(['orderedQty', 'documentQty']),
      priceColumns: new Set<string>([
        'lastPurchaseItemCost',
        'minItemCostPreTax',
        'maxItemCostPreTax',
        'avgItemCostPreTax',
        'purchasedValuePreTax',
        'taxAmount',
        'purchasedValuePostTax',
        'invoiceDiscount',
        'otherFees',
        'grandTotal',
        'totalItemDiscount',
        'totalFOCValue',
      ]),
    },
  ],
  [
    ProcurementReportTypeEnum.ItemsByPriceChanges,
    {
      priceColumns: new Set<string>([
        'oldPrice',
        'newPrice',
        'absPriceDifference',
      ]),
    },
  ],
  [
    ProcurementReportTypeEnum.Items,
    {
      qtyColumns: new Set<string>(['orderedQty', 'documentQty']),
      priceColumns: new Set<string>([
        'lastPurchaseItemCost',
        'minItemCostPreTax',
        'maxItemCostPreTax',
        'avgItemCostPreTax',
        'subTotal',
        'taxAmount',
        'invoiceDiscount',
        'otherFees',
        'grandTotal',
        'total',
        'totalItemDiscount',
        'totalFOCValue',
      ]),
    },
  ],
  [
    ProcurementReportTypeEnum.Orders,
    {
      priceColumns: new Set<string>([
        'orderedValuePreTax',
        'purchasedValuePreTax',
      ]),
      dateColumns: new Set<string>(['submissionDate']),
    },
  ],
  [
    ProcurementReportTypeEnum.PurchaseValue,
    {
      priceColumns: new Set<string>([
        'orderedValuePreTax',
        'subTotal',
        'taxAmount',
        'invoiceDiscount',
        'otherFees',
        'grandTotal',
        'total',
        'numberOfDocuments',
        'totalItemDiscount',
        'totalFOCValue',
      ]),
    },
  ],
  [
    ProcurementReportTypeEnum.Suppliers,
    {
      priceColumns: new Set<string>([
        'orderedValuePreTax',
        'subTotal',
        'taxAmount',
        'total',
        'invoiceDiscount',
        'otherFees',
        'grandTotal',
        'totalItemDiscount',
        'totalFOCValue',
        'fulfillmentRate',
      ]),
    },
  ],
  [
    ProcurementReportTypeEnum.CentralKitchen,
    {
      priceColumns: new Set<string>([
        'orderedValue',
        'packageCost',
        'cost',
        'shippedValue',
        'receivedValue',
        'diff',
      ]),
      qtyColumns: new Set<string>(['receivedQty', 'shippedQty', 'orderedQty']),
      dateColumns: new Set<string>([
        'orderDate',
        'receivedDate',
        'shippedDate',
        'deliveryDate',
      ]),
    },
  ],
  [
    ProcurementReportTypeEnum.CentralKitchenB2B,
    {
      priceColumns: new Set<string>([
        'orderedValue',
        'itemCost',
        'itemPrice',
        'shippedValue',
        'receivedValue',
        'totalCost',
        'profitPct',
      ]),
      qtyColumns: new Set<string>(['receivedQty', 'shippedQty', 'orderedQty']),
      dateColumns: new Set<string>(['orderDate', 'deliveryDate']),
    },
  ],
  //---------------------------------Cogs---------------------------------------------
  [
    SalesReportTypeEnum.CostOverview,
    {
      priceColumns: new Set<string>([
        'openingStockValue',
        'purchaseValue',
        'deliveryNoteValue',
        'netTransfers',
        'actualClosingStockValue',
        'actualCOGS',
        'totalRevenue',
        'costRevenueMargin',
        'COGSFromSalesValue',
        'internalSalesCost',
        'uncontrolledCost',
        'COGSWastageValue',
        'expenseWastageValue',
        'netAdjustments',
        'discountsAndFOCs',
        'invoiceDiscounts',
      ]),
      customHeaderStyles: new Map<string, FillPattern>(
        ['', 'totalRevenue', 'costRevenueMargin'].map((col) => {
          if (col === '') {
            return ['', { type: 'pattern', pattern: 'none' }];
          }

          return [
            col,
            {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '66ccff' },
            },
          ];
        })
      ),
    },
  ],
  [
    SalesReportTypeEnum.CostPerLocation,
    {
      priceColumns: new Set<string>([
        'openingStockValue',
        'purchaseValue',
        'deliveryNoteValue',
        'netTransfers',
        'actualClosingStockValue',
        'actualCOGS',
        'totalRevenue',
        'costRevenueMargin',
        'COGSFromSalesValue',
        'uncontrolledCost',
        'COGSWastageValue',
        'internalSalesCost',
        'expenseWastageValue',
        'netAdjustments',
        'discountsAndFOCs',
        'invoiceDiscounts',
      ]),
      dateColumns: new Set<string>(['lastCountedDate']),
      customHeaderStyles: new Map<string, FillPattern>(
        ['', 'totalRevenue', 'costRevenueMargin'].map((col) => {
          if (col === '') {
            return ['', { type: 'pattern', pattern: 'none' }];
          }

          return [
            col,
            {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '66ccff' },
            },
          ];
        })
      ),
    },
  ],
  [
    SalesReportTypeEnum.RecipeSales,
    {
      priceColumns: new Set<string>([
        'revenueExclTax',
        'revenueMixPercentage',
        'revenueInclTax',
        'avgSellingPrice',
        'totalDiscountValue',
        'cogsFromSales',
        'grossProfit',
        'profitMargin',
        'profitMixPercentage',
        'revenueExclTax',
        'revenueMixPercentage',
        'revenueInclTax',
        'avgSellingPrice',
        'totalDiscountValue',
        'cogsFromSalesMargin',
        'grossProfit',
        'profitMixPercentage',
        'profitMargin',
        'itemCost',
        'depletedValue',
      ]),
      qtyColumns: new Set<string>(['soldQty', 'depletedQty']),
      dateColumns: new Set<string>(['eventDate']),
    },
  ],
]);

export const reportsExtraColumnsMap = new Map<AllReportType, ExtraColumns>([
  //---------------------------------Inventory---------------------------------------------
  [
    InventoryReportTypeEnum.BranchRecipeListing,
    {
      itemCodeKeys: ['posItemId', 'recipeCode', 'ingredientCode'],

      optionalKeys: ['categoryName1', 'categoryName2', 'categoryName3'],

      booleanKeys: ['modifier', 'includedInCost'],
    },
  ],
  [
    InventoryReportTypeEnum.RecipeListing,
    {
      itemCodeKeys: ['recipeCode', 'ingredientCode'],

      optionalKeys: ['categoryName1', 'categoryName2', 'categoryName3'],

      booleanKeys: ['isStockable', 'modifier', 'includedInCost'],
    },
  ],
  //---------------------------------Cogs---------------------------------------------
  [
    SalesReportTypeEnum.RecipeSales,
    {
      itemCodeKeys: [
        'posItemId',
        'recipeCode',
        'parentItemId',
        'soldRecipeCode',
        'ingredientCode',
      ],

      optionalKeys: [
        'menuCategory1',
        'menuCategory2',
        'menuCategory3',
        'parentItemId',
        'parentItemName',
      ],

      booleanKeys: ['isStockable'],
    },
  ],
]);

export const reportsColumnsMap = new Map<
  AllReportType,
  Map<GenerateReportOutputProps, WorkSheetProps>
>([
  //---------------------------------Inventory-----------------------------------------------
  [
    InventoryReportTypeEnum.BranchRecipeListing,
    new Map<GenerateReportOutputProps, WorkSheetProps>([
      [
        'overview',
        {
          name: 'Overview',
          columns: [
            'recipeCode',
            'recipeName',
            'outletName',
            'locationName',
            'categoryName1',
            'categoryName2',
            'categoryName3',
            'recipeType',
            'mappedPluCodes',
            'mappedPluNames',
            'items',
            'portionSize',
            'recipeUoM',
            'recipeCost',
            'foodCostPercentage',
            'sellingPrice',
            'netSellingPrice',
          ],
          nameMapper: new Map<string, string>([
            ['sellingPrice', 'Gross Selling Price'],
          ]),
        },
      ],
      [
        'byItem',
        {
          name: 'Breakdown By Item',
          columns: [
            'recipeCode',
            'recipeName',
            'outletName',
            'locationName',
            'categoryName1',
            'categoryName2',
            'categoryName3',
            'recipeType',
            'items',
            'portionSize',
            'recipeUoM',
            'recipeCost',
            'foodCostPercentage',
            'sellingPrice',
            'netSellingPrice',
            'ingredientCode',
            'ingredientName',
            'ingredientType',
            'netQty',
            'itemUoM',
            'prepWastagePercentage',
            'grossQty',
            'ingredientCost',
            'lastPurchaseCost',
            'modifier',
            'includedInCost',
          ],
          nameMapper: new Map<string, string>([
            ['sellingPrice', 'Gross Selling Price'],
          ]),
        },
      ],
    ]),
  ],
  [
    InventoryReportTypeEnum.ItemActivity,
    new Map<GenerateReportOutputProps, WorkSheetProps>([
      [
        'overview',
        {
          name: 'Overview',
          columns: [
            'itemName',
            'itemType',
            'consumedAs',
            'accountingTag',
            'itemCategory',
            'itemSubCategory',
            'itemCode',
            'baseUoM',
            'date',
            'outletName',
            'locationName',
            'eventQty',
            'eventValue',
            'newItemCost',
            'qtyAfter',
            'valueAfter',
            'eventType',
            'eventName',
            'user',
          ],
        },
      ],
    ]),
  ],
  [
    InventoryReportTypeEnum.Production,
    new Map<GenerateReportOutputProps, WorkSheetProps>([
      [
        'overview',
        {
          name: 'Overview',
          columns: [
            'outletName',
            'locationName',
            'itemsProduced',
            'ingredientsUsed',
            'totalValue',
          ],
        },
      ],
      [
        'byIngredient',
        {
          name: 'By Ingredient',
          columns: [
            'outletName',
            'locationName',
            'ingredientName',
            'ingredientType',
            'category1',
            'category2',
            'category3',
            'uom',
            'totalQty',
            'totalValue',
            'recipesProduced',
            'events',
          ],
        },
      ],
      [
        'byEvent',
        {
          name: 'Breakdown By Event',
          columns: [
            'eventDate',
            'outletName',
            'locationName',
            'eventName',
            'recipeCode',
            'recipeName',
            'menuCategory1',
            'menuCategory2',
            'menuCategory3',
            'uom',
            'totalQty',
            'totalValue',
            'submittedBy',
            'remarks',
          ],
        },
      ],
      [
        'breakdown',
        {
          name: 'Breakdown',
          columns: [
            'locationName',
            'outletName',
            'eventName',
            'eventDate',
            'recipeName',
            'recipeCategory1',
            'recipeCategory2',
            'recipeCategory3',
            'recipeUoM',
            'totalQty',
            'totalValue',
            'ingredientName',
            'ingredientType',
            'category1',
            'category2',
            'category3',
            'uom',
            'ingredientQty',
            'ingredientValue',
          ],
        },
      ],
    ]),
  ],
  [
    InventoryReportTypeEnum.RecipeListing,
    new Map<GenerateReportOutputProps, WorkSheetProps>([
      [
        'overview',
        {
          name: 'Overview',
          columns: [
            'recipeCode',
            'recipeName',
            'categoryName1',
            'categoryName2',
            'categoryName3',
            'isStockable',
            'recipeType',
            'mappedPluCodes',
            'mappedPluNames',
            'items',
            'portionSize',
            'recipeUoM',
            'recipeCost',
            'foodCostPercentage',
            'recipePrice',
            'netSellingPrice',
          ],
          nameMapper: new Map<string, string>([
            ['recipePrice', 'Gross Selling Price'],
          ]),
        },
      ],
      [
        'byItem',
        {
          name: 'Breakdown By Item',
          columns: [
            'recipeCode',
            'recipeName',
            'categoryName1',
            'categoryName2',
            'categoryName3',
            'isStockable',
            'recipeType',
            'items',
            'portionSize',
            'recipeUoM',
            'recipeCost',
            'foodCostPercentage',
            'recipePrice',
            'netSellingPrice',
            'ingredientCode',
            'ingredientName',
            'ingredientType',
            'netQty',
            'itemUoM',
            'prepWastagePercentage',
            'grossQty',
            'lastPurchaseCost',
            'modifier',
            'includedInCost',
          ],
          nameMapper: new Map<string, string>([
            ['recipePrice', 'Gross Selling Price'],
          ]),
        },
      ],
    ]),
  ],
  [
    InventoryReportTypeEnum.StockMovementBetweenCounts,
    new Map<GenerateReportOutputProps, WorkSheetProps>([
      [
        'overview',
        {
          name: 'Overview',
          columns: [
            'outletName',
            'locationName',
            'openingStockValue',
            'purchaseValue',
            'productionInValue',
            'transferInValue',
            'mergedInValue',
            'cogsFromSalesValue',
            'productionOutValue',
            'transferOutValue',
            'shippedOutValue',
            'shippedOutQty',
            'mergedOutValue',
            'wastedValue',
            'actualClosingStockValue',
            'uncontrolledStockValue',
          ],
        },
      ],
      [
        'byItem',
        {
          name: 'Breakdown By Item',
          columns: [
            'itemName',
            'itemType',
            // 'itemActivityTag',
            'accountingTag',
            'itemCategory',
            'itemSubCategory',
            'itemCode',
            'baseUoM',
            'outletName',
            'locationName',
            'lastCountedDate',
            'openingStockQty',
            'receivedQty',
            'productionInQty',
            'transferInQty',
            'mergedInQty',
            'cogsFromSalesQty',
            'productionOutQty',
            'transferOutQty',
            'shippedOutQty',
            'mergedOutQty',
            'wastedQty',
            'actualClosingStockQty',
            'uncontrolledStockQty',
            'openingStockValue',
            'purchaseValue',
            'productionInValue',
            'transferInValue',
            'mergedInValue',
            'cogsFromSalesValue',
            'productionOutValue',
            'transferOutValue',
            'shippedOutValue',
            'mergedOutValue',
            'wastedValue',
            'actualClosingStockValue',
            'uncontrolledStockValue',
          ],
        },
      ],
      [
        'byEvent',
        {
          name: 'Breakdown By Event',
          columns: [
            'itemName',
            'itemType',
            'consumedAs',
            'accountingTag',
            'itemCategory',
            'itemSubCategory',
            'itemCode',
            'baseUoM',
            'date',
            'outletName',
            'locationName',
            'avgItemCost',
            'qtyChange',
            'valueChange',
            'eventType',
          ],
        },
      ],
    ]),
  ],
  [
    InventoryReportTypeEnum.StockMovements,
    new Map<GenerateReportOutputProps, WorkSheetProps>([
      [
        'overview',
        {
          name: 'Overview',
          columns: [
            'outletName',
            'locationName',
            'purchaseValue',
            'productionInValue',
            'transferInValue',
            'mergedInValue',
            'cogsFromSalesValue',
            'productionOutValue',
            'transferOutValue',
            'mergedOutValue',
            'wastedValue',
            'uncontrolledStockValue',
          ],
        },
      ],
      [
        'byItem',
        {
          name: 'Breakdown By Item',
          columns: [
            'itemName',
            'itemType',
            // 'itemActivityTag',
            'accountingTag',
            'itemCategory',
            'itemSubCategory',
            'itemCode',
            'baseUoM',
            'outletName',
            'locationName',
            'lastCountedDate',
            'openingStockQty',
            'receivedQty',
            'productionInQty',
            'transferInQty',
            'mergedInQty',
            'cogsFromSalesQty',
            'productionOutQty',
            'transferOutQty',
            'shippedOutQty',
            'mergedOutQty',
            'wastedQty',
            'actualClosingStockQty',
            'uncontrolledStockQty',
            'openingStockValue',
            'purchaseValue',
            'productionInValue',
            'transferInValue',
            'mergedInValue',
            'cogsFromSalesValue',
            'productionOutValue',
            'transferOutValue',
            'shippedOutValue',
            'mergedOutValue',
            'wastedValue',
            'actualClosingStockValue',
            'uncontrolledStockValue',
          ],
        },
      ],
      [
        'byEvent',
        {
          name: 'Breakdown By Event',
          columns: [
            'itemName',
            'itemType',
            'consumedAs',
            'accountingTag',
            'itemCategory',
            'itemSubCategory',
            'itemCode',
            'baseUoM',
            'date',
            'outletName',
            'locationName',
            'avgItemCost',
            'qtyChange',
            'valueChange',
            'eventType',
          ],
        },
      ],
    ]),
  ],
  [
    InventoryReportTypeEnum.StockValue,
    new Map<GenerateReportOutputProps, WorkSheetProps>([
      [
        'overview',
        {
          name: 'Overview',
          columns: [
            'outletName',
            'locationName',
            'effectiveDate',
            'stockValue',
          ],
        },
      ],
      [
        'byItem',
        {
          name: 'Breakdown By Item',
          columns: [
            'outletName',
            'locationName',
            'itemCode',
            'itemName',
            'itemType',
            'baseUoM',
            'itemCategory',
            'itemSubCategory',
            'itemStatus',
            'costPerUnit',
            'stockQty',
            'stockValue',
            'latestEventDate',
          ],
        },
      ],
      [
        'category',
        {
          name: 'By Category',
          columns: [
            'outletName',
            'locationName',
            'itemCategory',
            'stockValue',
            'latestEventDate',
          ],
        },
      ],
      [
        'subCategory',
        {
          name: 'By Sub Category',
          columns: [
            'outletName',
            'locationName',
            'itemCategory',
            'itemSubCategory',
            'stockValue',
            'latestEventDate',
          ],
        },
      ],
    ]),
  ],
  [
    InventoryReportTypeEnum.Transfer,
    new Map<GenerateReportOutputProps, WorkSheetProps>([
      [
        'overview',
        {
          name: 'Overview',
          columns: [
            'outletName',
            'locationName',
            'transferOutItems',
            'transferOutEvents',
            'transferOutValue',
            'transferInItems',
            'transferInEvents',
            'transferInValue',
          ],
        },
      ],
      [
        'byEvent',
        {
          name: 'Breakdown By Event',
          columns: [
            'eventCode',
            'status',
            'outletTransferFrom',
            'locationTransferFrom',
            'outletTransferTo',
            'locationTransferTo',
            'eventDate',
            'itemCode',
            'itemName',
            'accountingTag',
            'itemType',
            'transferAs',
            'itemCategory',
            'itemSubCategory',
            'baseUoM',
            'QTY',
            'totalTransferValue',
            'submittedBy',
            'receivedBy',
            'remarks',
          ],
        },
      ],
    ]),
  ],
  [
    InventoryReportTypeEnum.Variance,
    new Map<GenerateReportOutputProps, WorkSheetProps>([
      [
        'overview',
        {
          name: 'Overview',
          columns: [
            'outletName',
            'locationName',
            'onHandValue',
            'countedValue',
            'valueVariance',
          ],
        },
      ],
      [
        'byItem',
        {
          name: 'Breakdown By Item',
          columns: [
            'outletName',
            'locationName',
            'itemName',
            'itemType',
            'accountingTag',
            'itemCategory',
            'itemSubCategory',
            'itemCode',
            'baseUoM',
            'lastCountedDate',
            'onHandQty',
            'countedQty',
            'qtyVariance',
            'onHandValue',
            'countedValue',
            'valueVariance',
          ],
        },
      ],
      [
        'category',
        {
          name: ' By Category',
          columns: [
            'outletName',
            'locationName',
            'itemCategory',
            'onHandValue',
            'countedValue',
            'valueVariance',
          ],
        },
      ],
      [
        'subCategory',
        {
          name: ' By Sub Category',
          columns: [
            'outletName',
            'locationName',
            'itemCategory',
            'itemSubCategory',
            'onHandValue',
            'countedValue',
            'valueVariance',
          ],
        },
      ],
    ]),
  ],
  [
    InventoryReportTypeEnum.Wastage,
    new Map<GenerateReportOutputProps, WorkSheetProps>([
      [
        'overview',
        {
          name: 'Overview',
          columns: [
            'outletName',
            'locationName',
            'wastedItems',
            'COGSWastageValue',
            'expenseWastageValue',
            'totalWastageValue',
          ],
        },
      ],
      [
        'byItem',
        {
          name: 'Breakdown By Item',
          columns: [
            'itemName',
            'itemType',
            'code',
            'baseUoM',
            'isStockable',
            'category',
            'itemSubCategory',
            'parentCategory',
            'wastedQty',
            'COGSWastageValue',
            'expenseWastageValue',
            'totalWastageValue',
          ],
        },
      ],
      [
        'byItemEvent',
        {
          name: 'Breakdown By Event Item',
          columns: [
            'outletName',
            'locationName',
            'wastageType',
            'wastageExpense',
            'eventDate',
            'eventName',
            'eventCode',
            'itemName',
            'itemType',
            'code',
            'baseUoM',
            'isStockable',
            'category',
            'itemSubCategory',
            'parentCategory',
            'wastedQty',
            'wastageValue',
            'submittedBy',
            'remarks',
          ],
        },
      ],
      [
        'byIngredient',
        {
          name: 'Breakdown By Ingredient',
          columns: [
            'itemName',
            'itemType',
            'accountingTag',
            'itemCategory',
            'itemSubCategory',
            'itemCode',
            'wastageType',
            'baseUoM',
            'wastedQty',
            'COGSWastageValue',
            'expenseWastageValue',
            'totalWastageValue',
          ],
        },
      ],
      [
        'byIngredientEvent',
        {
          name: 'Breakdown By Ingredient Event',
          columns: [
            'date',
            'outletName',
            'locationName',
            'eventName',
            'eventCode',
            'wastageType',
            'itemCode',
            'itemName',
            'itemType',
            'wastedAs',
            'accountingTag',
            'itemCategory',
            'itemSubCategory',
            'baseUoM',
            'qty',
            'totalWastageValue',
            'submittedBy',
            'remarks',
          ],
        },
      ],
      [
        'byType',
        {
          name: 'Breakdown By Type',
          columns: [
            'wastageType',
            'wastageAccountingTag',
            'wastedItems',
            'totalWastageValue',
          ],
        },
      ],
      [
        'byTypeByLocation',
        {
          name: 'Breakdown By Type per Location',
          columns: [
            'outletName',
            'locationName',
            'wastageType',
            'wastageAccountingTag',
            'wastedItems',
            'totalWastageValue',
            'proratedLimit',
            'costVsLimitPercent',
          ],
        },
      ],
    ]),
  ],
  //-------------------------------------Procurement----------------------------------------
  [
    ProcurementReportTypeEnum.AllPurchases,
    new Map<GenerateReportOutputProps, WorkSheetProps>([
      [
        'overview',
        {
          name: 'Overview',
          columns: [
            'itemCode',
            'baseItemName',
            'itemName',
            'invoiceNumber',
            'documentDate',
            'bookingDate',
            'supplierName',
            'outlet',
            'location',
            'itemCategory',
            'itemSubCategory',
            'receivedQty',
            'documentQty',
            'expectedPrice',
            'invoicePrice',
            'subTotal',
            'invoiceDiscount',
            'otherFees',
            'total',
            'taxAmount',
            'grandTotal',
            'totalItemDiscount',
            'totalFOCValue',
          ],
        },
      ],
    ]),
  ],
  [
    ProcurementReportTypeEnum.Invoices,
    (() => {
      const orderedCoreColumns = [
        'invoiceNumber',
        'outlet',
        'location',
        'invoiceDate',
        'bookingDate',
        'supplier',
        'PO',
        'isPaid',
        'paymentDate',
      ];
      const orderedFinancialColumns = [
        'subTotal',
        'invoiceDiscount',
        'otherFees',
        'total',
        'taxAmount',
        'grandTotal',
        'totalItemDiscount',
        'totalFOCValue',
      ];
      const overviewHeader = [
        ...orderedCoreColumns,
        ...orderedFinancialColumns,
      ];

      return new Map<GenerateReportOutputProps, WorkSheetProps>([
        [
          'overview',
          {
            name: 'Overview',
            columns: overviewHeader,
          },
        ],
        [
          'category',
          {
            name: 'By Category',
            columns: [
              ...orderedCoreColumns,
              'itemCategory',
              ...orderedFinancialColumns,
            ],
          },
        ],
        [
          'subCategory',
          {
            name: 'By Sub Category',
            columns: [
              ...orderedCoreColumns,
              'itemCategory',
              'itemSubCategory',
              ...orderedFinancialColumns,
            ],
          },
        ],
      ]);
    })(),
  ],
  [
    ProcurementReportTypeEnum.ItemsBySupplier,
    (() => {
      const orderedCoreColumns = [
        'itemCode',
        'baseItemName',
        'itemName',
        'supplier',
        'itemCategory',
        'itemSubCategory',
      ];
      const orderedFinancialColumns = [
        'orderedQty',
        'documentQty',
        'lastPurchaseItemCost',
        'minItemCostPreTax',
        'avgItemCostPreTax',
        'maxItemCostPreTax',
        'subTotal',
        'invoiceDiscount',
        'otherFees',
        'total',
        'taxAmount',
        'grandTotal',
        'totalItemDiscount',
        'totalFOCValue',
      ];
      const overviewHeader = [
        ...orderedCoreColumns,
        ...orderedFinancialColumns,
      ];

      return new Map<GenerateReportOutputProps, WorkSheetProps>([
        [
          'overview',
          {
            name: 'Overview',
            columns: overviewHeader,
          },
        ],
        [
          'location',
          {
            name: 'By Location',
            columns: [
              ...orderedCoreColumns,
              'location',
              ...orderedFinancialColumns,
            ],
          },
        ],
        [
          'month',
          {
            name: 'By Month',
            columns: [
              ...orderedCoreColumns,
              'month',
              ...orderedFinancialColumns,
            ],
          },
        ],
        [
          'day',
          {
            name: 'By Day',
            columns: [
              ...orderedCoreColumns,
              'date',
              ...orderedFinancialColumns,
            ],
          },
        ],
      ]);
    })(),
  ],
  [
    ProcurementReportTypeEnum.ItemsByPriceChanges,
    new Map<GenerateReportOutputProps, WorkSheetProps>([
      [
        'overview',
        {
          name: 'Overview',
          columns: [
            'updatedAt',
            'itemCode',
            'itemName',
            'itemCategory',
            'itemSubCategory',
            'supplier',
            'oldPrice',
            'newPrice',
            'absPriceDifference',
          ],
        },
      ],
    ]),
  ],
  [
    ProcurementReportTypeEnum.Items,
    (() => {
      const orderedCoreColumns = [
        'itemCode',
        'baseItemName',
        'itemName',
        'itemCategory',
        'itemSubCategory',
        'recipesLinked',
      ];
      const orderedFinancialColumns = [
        'numberOfDocuments',
        'orderedQty',
        'documentQty',
        'lastPurchaseItemCost',
        'minItemCostPreTax',
        'avgItemCostPreTax',
        'maxItemCostPreTax',
        'subTotal',
        'invoiceDiscount',
        'otherFees',
        'total',
        'taxAmount',
        'grandTotal',
        'totalItemDiscount',
        'totalFOCValue',
      ];
      const overviewHeader = [
        ...orderedCoreColumns,
        'suppliersNb',
        'suppliers',
        'orderedValuePreTax',
        ...orderedFinancialColumns,
      ];

      return new Map<GenerateReportOutputProps, WorkSheetProps>([
        [
          'overview',
          {
            name: 'Overview',
            columns: overviewHeader,
          },
        ],
        [
          'location',
          {
            name: 'By Location',
            columns: [
              ...orderedCoreColumns,
              'location',
              ...orderedFinancialColumns,
            ],
          },
        ],
        [
          'month',
          {
            name: 'By Month',
            columns: [
              ...orderedCoreColumns,
              'month',
              ...orderedFinancialColumns,
            ],
          },
        ],
        [
          'day',
          {
            name: 'By Day',
            columns: [
              ...orderedCoreColumns,
              'date',
              ...orderedFinancialColumns,
            ],
          },
        ],
      ]);
    })(),
  ],
  [
    ProcurementReportTypeEnum.Orders,
    (() => {
      const orderedCoreColumns = [
        'LPO',
        'outlet',
        'location',
        'supplierName',
        'currentStatus',
        'submissionDate',
      ];
      const orderedFinancialColumns = [
        'orderedValuePreTax',
        'purchasedValuePreTax',
      ];
      const overviewHeader = [
        ...orderedCoreColumns,
        'orderedItems',
        ...orderedFinancialColumns,
      ];

      return new Map<GenerateReportOutputProps, WorkSheetProps>([
        [
          'overview',
          {
            name: 'Overview',
            columns: overviewHeader,
          },
        ],
        [
          'category',
          {
            name: 'By Category',
            columns: [
              ...orderedCoreColumns,
              'itemCategory',
              ...orderedFinancialColumns,
            ],
          },
        ],
        [
          'subCategory',
          {
            name: 'By Sub Category',
            columns: [
              ...orderedCoreColumns,
              'itemCategory',
              'itemSubCategory',
              ...orderedFinancialColumns,
            ],
          },
        ],
      ]);
    })(),
  ],
  [
    ProcurementReportTypeEnum.PurchaseValue,
    (() => {
      const orderedCoreColumns = ['outletName', 'location'];
      const orderedFinancialColumns = [
        'orderedValuePreTax',
        'subTotal',
        'invoiceDiscount',
        'otherFees',
        'total',
        'taxAmount',
        'grandTotal',
        'totalItemDiscount',
        'totalFOCValue',
      ];
      const overviewHeader = [
        ...orderedCoreColumns,
        'receivedItems',
        'numberOfDocuments',
        ...orderedFinancialColumns,
      ];

      return new Map<GenerateReportOutputProps, WorkSheetProps>([
        [
          'overview',
          {
            name: 'Overview',
            columns: overviewHeader,
          },
        ],
        [
          'category',
          {
            name: 'By Category',
            columns: [
              ...orderedCoreColumns,
              'itemCategory',
              ...orderedFinancialColumns,
            ],
          },
        ],
        [
          'subCategory',
          {
            name: 'By Sub Category',
            columns: [
              ...orderedCoreColumns,
              'itemCategory',
              'itemSubCategory',
              ...orderedFinancialColumns,
            ],
          },
        ],
        [
          'day',
          {
            name: 'By Day',
            columns: [
              ...orderedCoreColumns,
              'date',
              'numberOfDocuments',
              ...orderedFinancialColumns,
            ],
          },
        ],
        [
          'month',
          {
            name: 'By Month',
            columns: [
              ...orderedCoreColumns,
              'month',
              'numberOfDocuments',
              ...orderedFinancialColumns,
            ],
          },
        ],
      ]);
    })(),
  ],

  [
    ProcurementReportTypeEnum.Suppliers,
    (() => {
      const orderedCoreColumns = [
        'supplier',
        'supplierType',
        'receivedItems',
        'locationReceived',
      ];
      const orderedFinancialColumns = [
        'orderedValuePreTax',
        'subTotal',
        'invoiceDiscount',
        'otherFees',
        'total',
        'taxAmount',
        'grandTotal',
        'totalItemDiscount',
        'totalFOCValue',
      ];
      const overviewHeader = [
        ...orderedCoreColumns,
        'fulfillmentRate',
        ...orderedFinancialColumns,
      ];

      return new Map<GenerateReportOutputProps, WorkSheetProps>([
        [
          'overview',
          {
            name: 'Overview',
            columns: overviewHeader,
          },
        ],
        [
          'category',
          {
            name: 'By Category',
            columns: [
              ...orderedCoreColumns,
              'itemCategory',
              ...orderedFinancialColumns,
            ],
          },
        ],
        [
          'subCategory',
          {
            name: 'By Sub Category',
            columns: [
              ...orderedCoreColumns,
              'itemCategory',
              'itemSubCategory',
              ...orderedFinancialColumns,
            ],
          },
        ],
        [
          'location',
          {
            name: 'By Location',
            columns: [
              ...orderedCoreColumns,
              'location',
              ...orderedFinancialColumns,
            ],
          },
        ],
        [
          'month',
          {
            name: 'By Month',
            columns: [
              ...orderedCoreColumns,
              'month',
              ...orderedFinancialColumns,
            ],
          },
        ],
      ]);
    })(),
  ],
  [
    ProcurementReportTypeEnum.CentralKitchen,
    (() => {
      const orderedCoreColumns = [
        'CK',
        'outletName',
        'locationName',
        'orderNumber',
        'status',
        'orderDate',
        'deliveryDate',
        'shippedDate',
      ];
      const overviewHeader = [
        ...orderedCoreColumns,
        'orderedValue',
        'shippedValue',
        'receivedValue',
        'receivingValueDiscrepancy',
      ];
      const byItemHeader = [
        ...orderedCoreColumns,
        'itemCode',
        'packageName',
        'packageCost',
        'itemCategory',
        'itemSubCategory',
        'orderedQty',
        'orderedValue',
        'shippedQty',
        'shippedValue',
        'receivedQty',
        'receivedValue',
        'receivingValueDiscrepancy',
      ];

      const byGrnHeader = [
        ...orderedCoreColumns,
        'grnNumber',
        'receivedDate',
        'itemCode',
        'packageName',
        'packageCost',
        'itemCategory',
        'itemSubCategory',
        'receivedQty',
      ];

      return new Map<GenerateReportOutputProps, WorkSheetProps>([
        [
          'overview',
          {
            name: 'Overview',
            columns: overviewHeader,
          },
        ],
        [
          'byItem',
          {
            name: 'By Item',
            columns: byItemHeader,
          },
        ],
        [
          'byGrn',
          {
            name: 'By Grn',
            columns: byGrnHeader,
          },
        ],
      ]);
    })(),
  ],
  [
    ProcurementReportTypeEnum.CentralKitchenB2B,
    new Map<GenerateReportOutputProps, WorkSheetProps>([
      [
        'byItem',
        {
          name: 'By Item',
          columns: [
            'CK',
            'customerCode',
            'customerName',
            'customerType',
            'customerGroupName',
            'orderNumber',
            'status',
            'orderDate',
            'deliveryDate',
            'itemCode',
            'itemName',
            'itemCategory',
            'itemSubCategory',
            'shippedQty',
            'itemCost',
            'itemPrice',
            'totalCost',
            'shippedValue',
            'profitPct',
            'receivedQty',
            'receivedValue',
          ],
          nameMapper: new Map<string, string>([
            ['totalCost', 'Total Cost (qty*cost)'],
            ['shippedValue', 'Shipped Value (qty*price)'],
          ]),
        },
      ],
    ]),
  ],

  //-------------------------------------Cogs----------------------------------------
  [
    SalesReportTypeEnum.CostOverview,
    new Map<GenerateReportOutputProps, WorkSheetProps>([
      [
        'cogsOverview',
        {
          name: 'COGS Overview',
          columns: [
            'outletName',
            'locationName',
            'accountingTag',
            'openingStockValue',
            'purchaseValue',
            'deliveryNoteValue',
            'netTransfers',
            'actualClosingStockValue',
            'actualCOGS',
            'totalRevenue',
            'costRevenueMargin',
            '',
            'COGSFromSalesValue',
            'internalSalesCost',
            'uncontrolledCost',
            'COGSWastageValue',
            'expenseWastageValue',
            'netAdjustments',
            'discountsAndFOCs',
            'invoiceDiscounts',
          ],
          nameMapper: new Map<string, string>([
            ['costRevenueMargin', 'Cost of Sales Percentage'],
          ]),
        },
      ],
    ]),
  ],
  [
    SalesReportTypeEnum.CostPerLocation,
    new Map<GenerateReportOutputProps, WorkSheetProps>([
      [
        'cogsOverview',
        {
          name: 'COGS Overview',
          columns: [
            'outletName',
            'locationName',
            'accountingTag',
            'openingStockValue',
            'purchaseValue',
            'deliveryNoteValue',
            'netTransfers',
            'actualClosingStockValue',
            'actualCOGS',
            'totalRevenue',
            'costRevenueMargin',
            '',
            'COGSFromSalesValue',
            'internalSalesCost',
            'uncontrolledCost',
            'COGSWastageValue',
            'expenseWastageValue',
            'netAdjustments',
            'discountsAndFOCs',
            'invoiceDiscounts',
          ],
        },
      ],
      [
        'cogsPerItem',
        {
          name: 'COGS Per Item',
          columns: [
            'itemName',
            'itemType',
            'itemCode',
            'accountingTag',
            'baseUoM',
            'itemCategory',
            'itemSubCategory',
            'lastCountedDate',
            'openingStockValue',
            'purchaseValue',
            'deliveryNoteValue',
            'netTransfers',
            'actualClosingStockValue',
            'actualCOGS',
            'COGSFromSalesValue',
            'internalSalesCost',
            'uncontrolledCost',
            'COGSWastageValue',
            'expenseWastageValue',
            'netAdjustments',
            'discountsAndFOCs',
            'invoiceDiscounts',
          ],
        },
      ],
      [
        'cogsPerCategory',
        {
          name: 'COGS Per Category',
          columns: [
            'itemCategory',
            'itemSubCategory',
            'accountingTag',
            'openingStockValue',
            'purchaseValue',
            'deliveryNoteValue',
            'netTransfers',
            'actualClosingStockValue',
            'actualCOGS',
            'COGSFromSalesValue',
            'internalSalesCost',
            'uncontrolledCost',
            'COGSWastageValue',
            'expenseWastageValue',
            'netAdjustments',
            'discountsAndFOCs',
            'invoiceDiscounts',
          ],
        },
      ],
    ]),
  ],
  [
    SalesReportTypeEnum.RecipeSales,
    new Map<GenerateReportOutputProps, WorkSheetProps>([
      [
        'overview',
        {
          name: 'Overview',
          columns: [
            'recipeCode',
            'recipeName',
            'posItemId',
            'posItemName',
            'parentItemId',
            'parentItemName',
            'menuCategory1',
            'menuCategory2',
            'menuCategory3',
            'isStockable',
            'recipeItems',
            'soldQty',
            'revenueExclTax',
            'revenueMixPercentage',
            'revenueInclTax',
            'avgSellingPrice',
            'totalDiscountValue',
            'cogsFromSales',
            'cogsFromSalesMarginPercentage',
            'internalSalesCost',
            'grossProfit',
            'profitMixPercentage',
            'profitMarginPercentage',
          ],
        },
      ],
      [
        'byLocation',
        {
          name: 'Breakdown By Location',
          columns: [
            'outletName',
            'locationName',
            'recipeCode',
            'recipeName',
            'posItemId',
            'posItemName',
            'menuCategory1',
            'menuCategory2',
            'menuCategory3',
            'isStockable',
            'recipeItems',
            'soldQty',
            'revenueExclTax',
            'revenueMixPercentage',
            'revenueInclTax',
            'avgSellingPrice',
            'totalDiscountValue',
            'cogsFromSales',
            'cogsFromSalesMarginPercentage',
            'internalSalesCost',
            'grossProfit',
            'profitMixPercentage',
            'profitMarginPercentage',
          ],
        },
      ],
      [
        'byParent',
        {
          name: 'Aggregated By Parent',
          columns: [
            'recipeCode',
            'recipeName',
            'parentItemId',
            'parentItemName',
            'menuCategory1',
            'menuCategory2',
            'menuCategory3',
            'isStockable',
            'recipeItems',
            'soldQty',
            'revenueExclTax',
            'revenueMixPercentage',
            'revenueInclTax',
            'avgSellingPrice',
            'totalDiscountValue',
            'cogsFromSales',
            'cogsFromSalesMarginPercentage',
            'internalSalesCost',
            'grossProfit',
            'profitMixPercentage',
            'profitMarginPercentage',
          ],
        },
      ],
      [
        'byIngredient',
        {
          name: 'Breakdown By Ingredient',
          columns: [
            'importName',
            'outletName',
            'locationName',
            'eventDate',
            'soldRecipeCode',
            'soldRecipeName',
            'soldQty',
            'ingredientCode',
            'ingredientName',
            'baseUoM',
            'ingredientType',
            'ingredientCategory',
            'ingredientSubCategory',
            'itemCost',
            'depletedQty',
            'depletedValue',
          ],
        },
      ],
    ]),
  ],
]);
