import { ApiQueryMetadata } from '@supy.api/query';

import { AllReportTypeEnum, SimpleUser } from '../../common';

interface GenerateInvoicesReportRowOutput {
  readonly invoiceNumber: string;
  readonly supplier: string;
  readonly outlet: string;
  readonly location: string;
  readonly PO: number;
  readonly invoiceDate: Date;
  readonly bookingDate: Date;
  readonly isPaid: boolean;
  readonly paymentDate: Date;
  readonly subTotal: number;
  readonly total: number;
  readonly taxAmount: number;
  readonly invoiceDiscount: number;
  readonly otherFees: number;
  readonly grandTotal: number;
  readonly totalItemDiscount: number;
  readonly totalFOCValue: number;
}

interface GenerateInvoicesReportOverviewRowOutput
  extends GenerateInvoicesReportRowOutput {}

interface GenerateInvoicesReportCategoryRowOutput
  extends GenerateInvoicesReportRowOutput {
  readonly itemCategory: string;
}

interface GenerateInvoicesReportSubCategoryRowOutput
  extends GenerateInvoicesReportRowOutput {
  readonly itemCategory: string;
  readonly itemSubCategory: string;
}

export interface GenerateInvoicesReportOutput {
  readonly overview: GenerateInvoicesReportOverviewRowOutput[];
  readonly category: GenerateInvoicesReportCategoryRowOutput[];
  readonly subCategory: GenerateInvoicesReportSubCategoryRowOutput[];
}

interface GenerateSuppliersReportRowOutput {
  readonly supplier: string;
  readonly supplierType: string;
  readonly receivedItems: number;
  readonly locationReceived: number;
  readonly orderedValuePreTax: number;
  readonly subTotal: number;
  readonly total: number;
  readonly taxAmount: number;
  readonly invoiceDiscount: number;
  readonly otherFees: number;
  readonly grandTotal: number;
  readonly totalItemDiscount: number;
  readonly totalFOCValue: number;
}

interface GenerateSuppliersReportOverviewRowOutput
  extends GenerateSuppliersReportRowOutput {
  readonly fulfillmentRate: number;
}

interface GenerateSuppliersReportCategoryRowOutput
  extends GenerateSuppliersReportRowOutput {
  readonly itemCategory: string;
}

interface GenerateSuppliersReportSubCategoryRowOutput
  extends GenerateSuppliersReportRowOutput {
  readonly itemCategory: string;
  readonly itemSubCategory: string;
}

interface GenerateSuppliersReportMonthRowOutput
  extends GenerateSuppliersReportRowOutput {
  readonly fulfillmentRate: number;
  readonly month: string;
}

interface GenerateSuppliersReportLocationRowOutput
  extends GenerateSuppliersReportRowOutput {
  readonly fulfillmentRate: number;
  readonly location: string;
}

export interface GenerateSuppliersReportOutput {
  readonly overview: GenerateSuppliersReportOverviewRowOutput[];
  readonly category: GenerateSuppliersReportCategoryRowOutput[];
  readonly subCategory: GenerateSuppliersReportSubCategoryRowOutput[];
  readonly month: GenerateSuppliersReportMonthRowOutput[];
  readonly location: GenerateSuppliersReportLocationRowOutput[];
  readonly grn: GenerateReportGrnRowOutput[];
}

interface GenerateItemsBySupplierReportRowOutput {
  readonly itemCode: string;
  readonly baseItemName: string;
  readonly itemName: string;
  readonly supplier: string;
  readonly itemCategory: string;
  readonly itemSubCategory: string;
  readonly recipesLinked: number;
  readonly orderedQty: number;
  readonly documentQty: number;
  readonly lastPurchaseItemCost: number;
  readonly minItemCostPreTax: number;
  readonly avgItemCostPreTax: number;
  readonly maxItemCostPreTax: number;
  readonly subTotal: number;
  readonly taxAmount: number;
  readonly invoiceDiscount: number;
  readonly otherFees: number;
  readonly grandTotal: number;
  readonly total: number;
  readonly totalItemDiscount: number;
  readonly totalFOCValue: number;
}

interface GenerateItemsBySupplierReportOverviewRowOutput
  extends GenerateItemsBySupplierReportRowOutput {}

interface GenerateItemsBySupplierReportMonthRowOutput
  extends GenerateItemsBySupplierReportRowOutput {
  readonly month: string;
}

interface GenerateItemsBySupplierReportLocationRowOutput
  extends GenerateItemsBySupplierReportRowOutput {
  readonly location: string;
}

interface GenerateItemsBySupplierReportDayRowOutput
  extends GenerateItemsBySupplierReportRowOutput {
  readonly date: string;
}

export interface GenerateItemsBySupplierReportOutput {
  readonly overview: GenerateItemsBySupplierReportOverviewRowOutput[];
  readonly month: GenerateItemsBySupplierReportMonthRowOutput[];
  readonly location: GenerateItemsBySupplierReportLocationRowOutput[];
  readonly day: GenerateItemsBySupplierReportDayRowOutput[];
  readonly grn: GenerateReportGrnRowOutput[];
}

interface GenerateAllPurchasesReportOverviewRowOutput {
  readonly itemCode: string;
  readonly baseItemName: string;
  readonly itemName: string;
  readonly invoiceNumber: string;
  readonly documentDate: Date;
  readonly bookingDate: Date;
  readonly supplierName: string;
  readonly outlet: string;
  readonly location: string;
  readonly itemCategory: string;
  readonly itemSubCategory: string;
  readonly receivedQty: number;
  readonly documentQty: number;
  readonly expectedPrice: number;
  readonly invoicePrice: number;
  readonly subTotal: number;
  readonly total: number;
  readonly taxAmount: number;
  readonly invoiceDiscount: number;
  readonly otherFees: number;
  readonly grandTotal: number;
  readonly totalItemDiscount: number;
  readonly totalFOCValue: number;
}

export interface GenerateAllPurchasesReportOutput {
  readonly overview: GenerateAllPurchasesReportOverviewRowOutput[];
}

interface SalesCOGSCostReportBaseOutput {
  readonly accountingTag: string;
  readonly openingStockValue: number;
  readonly purchaseValue: number;
  readonly netTransfers: number;
  readonly actualClosingStockValue: number;
  readonly actualCOGS: number;
  readonly COGSFromSalesValue: number;
  readonly uncontrolledCost: number;
  readonly COGSWastageValue: number;
  readonly expenseWastageValue: number;
  readonly netAdjustments: number;
  readonly discountsAndFOCs: number;
  readonly invoiceDiscount: number;
}

interface SalesCOGSCostReportLocationOverviewOutput
  extends SalesCOGSCostReportBaseOutput {
  readonly outletId: string;
  readonly outletName: string;
  readonly locationId: string;
  readonly locationName: string;
}

interface SalesCOGSCostReportPerItemOutput
  extends SalesCOGSCostReportBaseOutput {
  readonly itemId: string;
  readonly itemName: string;
  readonly itemType: string;
  readonly itemCode: string;
  readonly baseUom: string;
  readonly itemCategoryId: string;
  readonly itemCategory: string;
  readonly itemSubCategory: string;
  readonly lastCountedDate: string;
}

interface SalesCOGSCostReportPerCategoryOutput
  extends SalesCOGSCostReportBaseOutput {
  readonly itemCategoryId: string;
  readonly itemCategory: string;
  readonly itemSubCategory: string;
}

export interface SalesCOGSCostPerLocationReportOutput {
  readonly cogsOverview: SalesCOGSCostReportLocationOverviewOutput[];
  readonly cogsPerItem: SalesCOGSCostReportPerItemOutput[];
  readonly cogsPerCategory: SalesCOGSCostReportPerCategoryOutput[];
}

export interface SalesCOGSCostOverviewReportOutput {
  readonly cogsOverview: SalesCOGSCostReportLocationOverviewOutput[];
}

interface GenerateStockMovementCountsReportOverviewOutput {
  readonly outletName: string;
  readonly locationName: string;
  readonly openingStockValue: number;
  readonly actualClosingStockValue: number;
  readonly uncontrolledStockValue: number;
}

interface GenerateStockMovementCountsReportItemsOutput {
  readonly itemName: string;
  readonly itemType: string;
  // readonly itemActivityTag: string;
  readonly accountingTag: string;
  readonly itemCategory: string;
  readonly itemSubCategory: string;
  readonly itemCode: string;
  readonly baseUoM: string;
  readonly outletName: string;
  readonly locationName: string;
  readonly lastCountedDate: Date;

  readonly openingStockQty: number;
  readonly receivedQty: number;
  readonly productionInQty: number;
  readonly transferInQty: number;
  readonly mergedInQty: number;
  readonly cogsFromSalesQty: number;

  readonly productionOutQty: number;
  readonly transferOutQty: number;
  readonly mergedOutQty: number;
  readonly wastedQty: number;

  readonly actualClosingStockQty: number;
  readonly uncontrolledStockQty: number;

  readonly openingStockValue: number;
  readonly purchaseValue: number;
  readonly productionInValue: number;
  readonly cogsFromSalesValue: number;
  readonly transferInValue: number;
  readonly mergedInValue: number;
  readonly productionOutValue: number;
  readonly transferOutValue: number;
  readonly mergedOutValue: number;
  readonly wastedValue: number;
  readonly actualClosingStockValue: number;
  readonly uncontrolledStockValue: number;
}

interface GenerateStockMovementCountsReportEventsOutput {
  readonly itemName: string;
  readonly itemType: string;
  // readonly itemActivityTag: string;
  readonly accountingTag: string;
  readonly itemCategory: string;
  readonly itemSubCategory: string;
  readonly itemCode: string;
  readonly baseUoM: string;
  readonly date: Date;
  readonly outletName: string;
  readonly locationName: string;
  readonly qtyChange: number;
  readonly valueChange: number;
  readonly eventType: string;
  readonly avgItemCost: number;
  readonly consumedAs: string;
}

interface GenerateStockMovementCountsReportOutput {
  readonly overview?: GenerateStockMovementCountsReportOverviewOutput[];
  readonly byItem?: GenerateStockMovementCountsReportItemsOutput[];
  readonly byEvent?: GenerateStockMovementCountsReportEventsOutput[];
}

interface GenerateStockMovementsReportOverviewOutput {
  readonly outletName: string;
  readonly locationName: string;
  readonly purchaseValue: number;
  readonly productionInValue: number;
  readonly transferInValue: number;
  readonly mergedInValue: number;
  readonly cogsFromSalesValue: number;
  readonly productionOutValue: number;
  readonly transferOutValue: number;
  readonly mergedOutValue: number;
  readonly wastedValue: number;
  readonly uncontrolledStockValue: number;
}

interface GenerateStockMovementsReportItemsOutput {
  readonly itemName: string;
  // readonly itemActivityTag: string;
  readonly accountingTag: string;
  readonly itemType: string;
  readonly itemCode: string;

  readonly baseUoM: string;
  readonly itemCategory: string;
  readonly itemSubCategory: string;
  readonly outletName: string;
  readonly locationName: string;
  readonly lastCountedDate: Date;

  readonly receivedQty: number;
  readonly productionInQty: number;
  readonly transferInQty: number;
  readonly mergedInQty: number;
  readonly cogsFromSalesQty: number;
  readonly productionOutQty: number;
  readonly transferOutQty: number;
  readonly mergedOutQty: number;
  readonly wastedQty: number;

  readonly uncontrolledStockQty: number;

  readonly purchaseValue: number;
  readonly productionInValue: number;
  readonly cogsFromSalesValue: number;
  readonly transferInValue: number;
  readonly mergedInValue: number;
  readonly productionOutValue: number;
  readonly transferOutValue: number;
  readonly mergedOutValue: number;
  readonly wastedValue: number;
  readonly uncontrolledStockValue: number;
}

interface GenerateStockMovementsReportEventsOutput {
  readonly itemName: string;
  readonly itemType: string;
  // readonly itemActivityTag: string;
  readonly accountingTag: string;
  readonly itemCategory: string;
  readonly itemSubCategory: string;
  readonly itemCode: string;
  readonly baseUoM: string;
  readonly date: Date;
  readonly outletName: string;
  readonly locationName: string;
  readonly qtyChange: number;
  readonly valueChange: number;
  readonly eventType: string;
  readonly avgItemCost: number;
  readonly consumedAs: string;
}

export interface GenerateStockMovementsReportOutput {
  readonly overview: GenerateStockMovementsReportOverviewOutput[];
  readonly byItem: GenerateStockMovementsReportItemsOutput[];
  readonly byEvent: GenerateStockMovementsReportEventsOutput[];
}

interface GenerateTransfersReportOverviewOutput {
  readonly outletName: string;
  readonly locationName: string;
  readonly transferOutItems: number;
  readonly transferOutEvents: number;
  readonly transferOutValue: number;
  readonly transferInItems: number;
  readonly transferInEvents: number;
  readonly transferInValue: number;
}

interface GenerateTransfersReportEventsOutput {
  readonly eventCode: string;
  readonly status: string;
  readonly outletTransferFrom: string;
  readonly locationTransferFrom: string;
  readonly outletTransferTo: string;
  readonly locationTransferTo: string;
  readonly eventDate: Date;
  readonly itemCode: string;
  readonly itemName: string;
  readonly accountingTag: string;
  readonly itemType: string;
  readonly itemCategory: string;
  readonly itemSubCategory: string;
  readonly baseUoM: string;
  readonly QTY: number;
  readonly totalTransferValue: number;
  readonly submittedBy: string;
  readonly receivedBy: string;
  readonly remarks: string;
  readonly transferAs: string;
}

export interface GenerateTransfersReportItemsOutput {
  readonly itemCode: string;
  readonly itemName: string;
  readonly accountingTag: string;
  readonly itemType: string;
  readonly itemCategory: string;
  readonly itemSubCategory: string;
  readonly baseUoM: string;
  readonly QTY: number;
  readonly transferValue: number;
}

interface GenerateTransfersReportOutput {
  readonly overview: GenerateTransfersReportOverviewOutput[];
  // readonly byItem: GenerateTransfersReportItemsOutput[];
  readonly byEvent: GenerateTransfersReportEventsOutput[];
}

interface GenerateWastageReportOverviewOutput {
  readonly outletName: string;
  readonly locationName: string;
  readonly wastedItems: number;
  readonly COGSWastageValue: number;
  readonly expenseWastageValue: number;
  readonly totalWastageValue: number;
}

interface GenerateWastageReportIngredientEventsOutput {
  readonly date: Date;
  readonly outletName: string;
  readonly locationName: string;
  readonly eventName: string;
  readonly wastageType: Date;
  readonly itemCode: string;
  readonly itemName: string;
  readonly itemType: string;
  readonly accountingTag: string;
  readonly itemCategory: string;
  readonly itemSubCategory: string;
  readonly baseUoM: string;
  readonly qty: number;
  readonly totalWastageValue: number;
  readonly submittedBy: string;
  readonly remarks: string;
  readonly wastedAs: string;
}

interface GenerateWastageReportIngredientsOutput {
  readonly itemName: string;
  readonly itemType: string;
  readonly accountingTag: string;
  readonly itemCategory: string;
  readonly itemSubCategory: string;
  readonly itemCode: string;
  readonly wastageType: string;
  readonly baseUoM: string;
  readonly wastedQty: number;
  readonly COGSWastageValue: number;
  readonly expenseWastageValue: number;
  readonly totalWastageValue: number;
}

interface GenerateWastageReportTypesOutput {
  readonly wastageType: string;
  readonly wastageAccountingTag: string;
  readonly wastedItems: number;
  readonly totalWastageValue: number;
}

interface GenerateWastageReportTypeLocationsOutput {
  readonly outletName: string;
  readonly locationName: string;
  readonly wastageType: string;
  readonly wastageAccountingTag: string;
  readonly wastedItems: number;
  readonly totalWastageValue: number;
  readonly proratedLimit: number;
  readonly costVsLimitPercent: number;
}

interface GenerateWastageReportItemsOutput {
  readonly itemName: string;
  readonly itemType: string;
  readonly code: string;
  readonly baseUoM: string;
  readonly isStockable: string;
  readonly category: string;
  readonly itemSubCategory: string;
  readonly parentCategory: string;
  readonly wastedQty: number;
  readonly COGSWastageValue: number;
  readonly expenseWastageValue: number;
  readonly totalWastageValue: number;
}

interface GenerateWastageReportItemEventsOutput {
  readonly outletName: string;
  readonly locationName: string;
  readonly wastageType: string;
  readonly wastageExpense: string;
  readonly eventDate: Date;
  readonly eventName: string;
  readonly itemName: string;
  readonly itemType: string;
  readonly code: string;
  readonly baseUoM: string;
  readonly isStockable: string;
  readonly category: string;
  readonly itemSubCategory: string;
  readonly parentCategory: string;
  readonly wastedQty: string;
  readonly wastageValue: string;
  readonly submittedBy: string;
  readonly remarks: string;
}

interface GenerateWastageReportOutput {
  readonly overview: GenerateWastageReportOverviewOutput[];
  readonly byIngredient: GenerateWastageReportIngredientsOutput[];
  readonly byIngredientEvent: GenerateWastageReportIngredientEventsOutput[];
  readonly byItem: GenerateWastageReportItemsOutput[];
  readonly byItemEvent: GenerateWastageReportItemEventsOutput[];
  readonly byType: GenerateWastageReportTypesOutput[];
  readonly byTypeByLocation: GenerateWastageReportTypeLocationsOutput[];
}

interface GenerateProductionReportOverviewOutput {
  readonly outletName: string;
  readonly locationName: string;
  readonly itemsProduced: number;
  readonly ingredientsUsed: number;
  readonly totalValue: number;
}

interface GenerateProductionReportIngredientsOutput {
  readonly outletName: string;
  readonly locationName: string;
  readonly ingredientName: string;
  readonly ingredientType: string;
  readonly category1: string;
  readonly category2: string;
  readonly category3: string;
  readonly uom: string;
  readonly totalQty: number;
  readonly totalValue: number;
  readonly recipesProduced: number;
  readonly events: number;
}

interface GenerateProductionReportEventsOutput {
  readonly eventDate: Date;
  readonly outletName: string;
  readonly locationName: string;
  readonly eventName: string;
  readonly recipeCode: string;
  readonly recipeName: string;
  readonly menuCategory1: string;
  readonly menuCategory2: string;
  readonly menuCategory3: string;
  readonly uom: string;
  readonly totalQty: number;
  readonly totalValue: number;
  readonly submittedBy: string;
  readonly remarks: string;
}

interface GenerateProductionReportBreakdownOutput {
  readonly locationName: string;
  readonly outletName: string;
  readonly eventName: string;
  readonly eventDate: string;
  readonly recipeName: string;
  readonly recipeCategory1: string;
  readonly recipeCategory2: string;
  readonly recipeCategory3: string;
  readonly recipeUoM: string;
  readonly totalQty: string;
  readonly totalValue: string;
  readonly ingredientName: string;
  readonly ingredientType: string;
  readonly category1: string;
  readonly category2: string;
  readonly category3: string;
  readonly uom: string;
  readonly ingredientQty: string;
  readonly ingredientValue: string;
}

interface GenerateProductionReportOutput {
  readonly overview: GenerateProductionReportOverviewOutput[];
  readonly byIngredient: GenerateProductionReportIngredientsOutput[];
  readonly byEvent: GenerateProductionReportEventsOutput[];
  readonly breakdown: GenerateProductionReportBreakdownOutput[];
}

interface GenerateVarianceReportOverviewOutput {
  readonly outletName: string;
  readonly locationName: string;
  readonly countedValue: number;
  readonly onHandValue: number;
  readonly valueVariance: number;
}

interface GenerateVarianceReportItemsOutput {
  readonly itemName: string;
  readonly itemType: string;
  readonly accountingTag: string;
  readonly itemCategory: string;
  readonly itemSubCategory: string;
  readonly itemCode: string;
  readonly baseUoM: string;
  readonly lastCountedDate: Date;

  readonly onHandQty: number;
  readonly countedQty: number;
  readonly qtyVariance: number;

  readonly onHandValue: number;
  readonly countedValue: number;
  readonly valueVariance: number;
}

interface GenerateVarianceReportOutput {
  readonly overview: GenerateVarianceReportOverviewOutput[];
  readonly byItem: GenerateVarianceReportItemsOutput[];
}

interface GenerateItemActivityBreakdownOutput {
  readonly itemName: string;
  readonly itemType: string;
  readonly consumedAs: string;
  readonly accountingTag: string;
  readonly itemCategory: string;
  readonly itemSubCategory: string;
  readonly itemCode: string;
  readonly baseUoM: string;
  readonly date: string;
  readonly outletName: string;
  readonly locationName: string;

  readonly eventQty: number;
  readonly eventValue: number;

  readonly newItemCost: number;
  readonly qtyAfter: number;
  readonly valueAfter: number;

  readonly eventType: string;
  readonly eventName: string;
  readonly user: string;
}

interface GenerateItemActivityReportOutput {
  readonly overview: GenerateItemActivityBreakdownOutput[];
}

interface GenerateStockValuePerItemOutput {
  readonly outletName: string;
  readonly locationName: string;

  readonly itemCode: string;
  readonly baseUoM: string;
  readonly itemName: string;
  readonly itemType: string;
  readonly itemStatus: string;
  readonly itemCategory: string;
  readonly itemSubCategory: string;
  readonly latestEventDate: string;

  readonly costPerUnit: number;
  readonly stockQty: number;
  readonly stockValue: number;
}

interface GenerateStockValueReportOutput {
  readonly overview: GenerateStockValuePerItemOutput[];
}

interface GenerateRecipeSalesReportOverviewOutput {
  readonly recipeCode: string;
  readonly recipeName: string;
  readonly posItemId: string;
  readonly posItemName: string;
  readonly menuCategory1: string;
  readonly menuCategory2: string;
  readonly menuCategory3: string;
  readonly isStockable: string;
  readonly recipeItems: number;
  readonly soldQty: number;
  readonly revenueExclTax: number;
  readonly revenueMixPercentage: number;
  readonly revenueInclTax: number;
  readonly avgSellingPrice: number;
  readonly totalDiscountValue: number;
  readonly cogsFromSales: number;
  readonly cogsFromSalesMarginPercentage: number;
  readonly grossProfit: number;
  readonly profitMarginPercentage: number;
  readonly profitMixPercentage: number;
}

interface GenerateRecipeSalesReportLocationsOutput {
  readonly outletName: string;
  readonly locationName: string;
  readonly recipeCode: string;
  readonly recipeName: string;
  readonly posItemId: string;
  readonly posItemName: string;
  readonly menuCategory1: string;
  readonly menuCategory2: string;
  readonly menuCategory3: string;
  readonly isStockable: string;
  readonly recipeItems: number;
  readonly soldQty: number;
  readonly revenueExclTax: number;
  readonly revenueMixPercentage: number;
  readonly revenueInclTax: number;
  readonly avgSellingPrice: number;
  readonly totalDiscountValue: number;
  readonly cogsFromSales: number;
  readonly cogsFromSalesMarginPercentage: number;
  readonly grossProfit: number;
  readonly profitMixPercentage: number;
  readonly profitMarginPercentage: number;
}

export interface GenerateRecipeSalesReportOutput {
  readonly overview: GenerateRecipeSalesReportOverviewOutput[];
  readonly byLocation: GenerateRecipeSalesReportLocationsOutput[];
}

interface GenerateBranchRecipeListingReportOverviewOutput {
  readonly recipeCode: string;
  readonly recipeName: string;
  readonly outletName: string;
  readonly locationName: string;
  readonly categoryName1: string;
  readonly categoryName2: string;
  readonly categoryName3: string;
  readonly recipeType: string;
  readonly items: number;
  readonly portionSize: number;
  readonly recipeUoM: string;
  readonly recipeCost: number;
  readonly foodCostPercentage: number;
  readonly sellingPrice: number;
}

interface GenerateBranchRecipeListingReportItemsOutput {
  readonly recipeCode: string;
  readonly recipeName: string;
  readonly outletName: string;
  readonly locationName: string;
  readonly categoryName1: string;
  readonly categoryName2: string;
  readonly categoryName3: string;
  readonly recipeType: string;
  readonly items: number;
  readonly portionSize: number;
  readonly recipeUoM: string;
  readonly recipeCost: number;
  readonly foodCostPercentage: number;
  readonly sellingPrice: number;
  readonly ingredientName: string;
  readonly ingredientType: string;
  readonly netQty: number;
  readonly itemUoM: string;
  readonly prepWastagePercentage: number;
  readonly grossQty: number;
  readonly lastPurchaseCost: number;
  readonly modifier: string;
  readonly includedInCost: string;
}

interface GenerateBranchRecipeListingReportOutput {
  readonly overview: GenerateBranchRecipeListingReportOverviewOutput[];
  readonly byItem: GenerateBranchRecipeListingReportItemsOutput[];
}

interface GenerateRecipeListingReportOverviewOutput {
  readonly recipeCode: string;
  readonly recipeName: string;
  readonly categoryName1: string;
  readonly categoryName2: string;
  readonly categoryName3: string;
  readonly isStockable: string;
  readonly recipeType: string;
  readonly items: number;
  readonly portionSize: number;
  readonly recipeUoM: string;
  readonly recipeCost: number;
  readonly foodCostPercentage: number;
  readonly recipePrice: number;
}

interface GenerateRecipeListingReportItemsOutput {
  readonly recipeCode: string;
  readonly recipeName: string;
  readonly categoryName1: string;
  readonly categoryName2: string;
  readonly categoryName3: string;
  readonly isStockable: string;
  readonly recipeType: string;
  readonly items: number;
  readonly portionSize: number;
  readonly recipeUoM: string;
  readonly recipeCost: number;
  readonly foodCostPercentage: number;
  readonly recipePrice: number;
  readonly ingredientName: string;
  readonly ingredientType: string;
  readonly netQty: string;
  readonly itemUoM: string;
  readonly prepWastagePercentage: string;
  readonly grossQty: number;
  readonly ingredientCost: number;
  readonly lastPurchaseCost: number;
  readonly modifier: string;
  readonly includedInCost: string;
}

interface GenerateRecipeListingReportOutput {
  readonly overview: GenerateRecipeListingReportOverviewOutput[];
  readonly byItem: GenerateRecipeListingReportItemsOutput[];
}

interface GenerateOrdersReportRowOutput {
  readonly LPO: string;
  readonly outlet: string;
  readonly location: string;
  readonly supplierName: string;
  readonly currentStatus: string;
  readonly submissionDate: Date;
  readonly orderedValuePreTax: number;
  readonly purchasedValuePreTax: number;
}

interface GenerateOrdersReportOverviewRowOutput
  extends GenerateOrdersReportRowOutput {
  readonly firstReceivingDate: Date;
  readonly orderedItems: number;
}

interface GenerateOrdersReportCategoryRowOutput
  extends GenerateOrdersReportRowOutput {
  readonly itemCategory: string;
}

interface GenerateOrdersReportSubCategoryRowOutput
  extends GenerateOrdersReportRowOutput {
  readonly itemCategory: string;
  readonly itemSubCategory: string;
}

export interface GenerateOrdersReportOutput {
  readonly overview: GenerateOrdersReportOverviewRowOutput[];
  readonly category: GenerateOrdersReportCategoryRowOutput[];
  readonly subCategory: GenerateOrdersReportSubCategoryRowOutput[];
}

interface GeneratePurchaseValueReportRowOutput {
  readonly outletName: string;
  readonly location: string;
  readonly orderedValuePreTax: number;
  readonly subTotal: number;
  readonly taxAmount: number;
  readonly invoiceDiscount: number;
  readonly otherFees: number;
  readonly grandTotal: number;
  readonly totalItemDiscount: number;
  readonly totalFOCValue: number;
  readonly total: number;
}

interface GeneratePurchaseValueReportOverviewRowOutput
  extends GeneratePurchaseValueReportRowOutput {
  readonly receivedItems: number;
  readonly numberOfDocuments: number;
}

interface GeneratePurchaseValueReportCategoryRowOutput
  extends GeneratePurchaseValueReportRowOutput {
  readonly itemCategory: string;
}

interface GeneratePurchaseValueReportSubCategoryRowOutput
  extends GeneratePurchaseValueReportRowOutput {
  readonly itemCategory: string;
  readonly itemSubCategory: string;
  readonly receivedItems: number;
}

interface GeneratePurchaseValueReportMonthRowOutput
  extends GeneratePurchaseValueReportRowOutput {
  readonly month: string;
  readonly receivedItems: number;
  readonly numberOfDocuments: number;
}

interface GeneratePurchaseValueReportDayRowOutput
  extends GeneratePurchaseValueReportRowOutput {
  readonly date: Date;
  readonly receivedItems: number;
  readonly numberOfDocuments: number;
}

interface GenerateReportGrnRowOutput {
  readonly invoiceNumber: string;
  readonly supplierName: string;
  readonly outlet: string;
  readonly location: string;
  readonly PO: string;
  readonly status: string;
  readonly documentType: string;
  readonly documentDate: Date;
  readonly bookingDate: Date;
  readonly isPaid: string;
  readonly paymentDate: Date;
  readonly invoiceDiscount: number;
  readonly otherFees: number;
  readonly subTotal: number;
  readonly grandTotal: number;
  readonly totalItemDiscount: number;
  readonly totalFOCValue: number;
  readonly total: number;
  readonly taxAmount: number;
}

export interface GeneratePurchaseValueReportOutput {
  readonly overview: GeneratePurchaseValueReportOverviewRowOutput[];
  readonly category: GeneratePurchaseValueReportCategoryRowOutput[];
  readonly subCategory: GeneratePurchaseValueReportSubCategoryRowOutput[];
  readonly month: GeneratePurchaseValueReportMonthRowOutput[];
  readonly day: GeneratePurchaseValueReportDayRowOutput[];
  readonly grn: GenerateReportGrnRowOutput[];
}

export interface GenerateProcurementReportExcelInput {
  readonly overview: { readonly [key: string]: string }[];
  readonly category?: { readonly [key: string]: string }[];
  readonly location?: { readonly [key: string]: string }[];
  readonly month?: { readonly [key: string]: string }[];
  readonly day?: { readonly [key: string]: string }[];
}

export interface GenerateItemPriceHistoryReportOutput {
  readonly itemName: string;
  readonly itemId: string;
  readonly supplierId: string;
  readonly supplierName: string;
  readonly updatedAt: Date;
  readonly oldPrice: number;
  readonly newPrice: number;
}

interface PriceHistoryItemData {
  readonly name: string;
  readonly id: string;
}

interface PriceHistorySupplierData {
  readonly id: string;
  readonly name: string;
}

export interface GenerateItemPriceHistoryOutput {
  readonly item: PriceHistoryItemData;
  readonly supplier: PriceHistorySupplierData;
  readonly updatedAt: Date;
  readonly oldPrice: number;
  readonly newPrice: number;
}

export interface GenerateItemsPriceUpdatedReportOutput {
  readonly overview: GenerateItemsPriceUpdatedReportOverviewRowOutput[];
}

interface GenerateItemsPriceUpdatedReportOverviewRowOutput {
  readonly itemCode: string;
  readonly itemName: string;
  readonly itemCategory: string;
  readonly iteSubCategory: string;
  readonly supplier: string;
  readonly updatedAt: Date;
  readonly oldPrice: number;
  readonly newPrice: number;
  readonly absPriceDifference: number;
}

export interface GenerateItemsReportOutput {
  readonly overview: GenerateItemsReportOverviewRowOutput[];
  readonly month: GenerateItemsReportMonthRowOutput[];
  readonly day: GenerateItemsReportDayRowOutput[];
  readonly location: GenerateItemsReportLocationRowOutput[];
  readonly grn: GenerateReportGrnRowOutput[];
}

interface GenerateItemsReportRowOutput {
  readonly itemCode: string;
  readonly baseItemName: string;
  readonly itemName: string;
  readonly itemCategory: string;
  readonly itemSubCategory: string;
  readonly recipesLinked: number;
  readonly numberOfDocuments: string;
  readonly orderedQty: number;
  readonly documentQty: number;
  readonly lastPurchaseItemCost: number;
  readonly minItemCostPreTax: number;
  readonly maxItemCostPreTax: number;
  readonly avgItemCostPreTax: number;
  readonly subTotal: number;
  readonly taxAmount: number;
  readonly invoiceDiscount: number;
  readonly otherFees: number;
  readonly total: number;
  readonly grandTotal: number;
  readonly totalItemDiscount: number;
  readonly totalFOCValue: number;
}

interface GenerateItemsReportOverviewRowOutput
  extends GenerateItemsReportRowOutput {
  readonly suppliersNb: number;
  readonly suppliers: string;
  readonly orderedValuePreTax: number;
}

interface GenerateItemsReportLocationRowOutput
  extends GenerateItemsReportRowOutput {
  readonly location: string;
}

interface GenerateItemsReportMonthRowOutput
  extends GenerateItemsReportRowOutput {
  readonly month: string;
}

interface GenerateItemsReportDayRowOutput extends GenerateItemsReportRowOutput {
  readonly date: string;
}

interface GetReportOutput {
  readonly requestedBy: string;
  readonly requestedOn: Date;
  readonly downloadUrl: string;
  readonly type: AllReportTypeEnum;
  readonly fileName: string;
}

export interface GetReportsOutput {
  readonly data: GetReportOutput[];
  readonly metadata: ApiQueryMetadata;
}

interface GetReportInteractorOutput {
  readonly requestedBy: SimpleUser;
  readonly requestedOn: Date;
  readonly downloadUrl: string;
  readonly type: AllReportTypeEnum;
  readonly fileName: string;
  readonly isAdmin?: boolean;
}

export interface GetReportsInteractorOutput {
  readonly data: GetReportInteractorOutput[];
  readonly metadata: ApiQueryMetadata;
}

export type GetCOGSReportOutput =
  | SalesCOGSCostReportLocationOverviewOutput[]
  | SalesCOGSCostReportPerItemOutput[]
  | SalesCOGSCostReportPerCategoryOutput[];

export type GenerateInventoryReportsOutput =
  | GenerateBranchRecipeListingReportOutput
  | GenerateItemActivityReportOutput
  | GenerateProductionReportOutput
  | GenerateRecipeListingReportOutput
  | GenerateStockMovementCountsReportOutput
  | GenerateStockValueReportOutput
  | GenerateTransfersReportOutput
  | GenerateVarianceReportOutput
  | GenerateWastageReportOutput;
