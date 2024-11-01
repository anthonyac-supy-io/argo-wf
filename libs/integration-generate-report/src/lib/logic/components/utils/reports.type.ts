import { FillPattern } from '@dima-supy-io/exceljs';

import {
  GenerateAllPurchasesReportOutput,
  GenerateBranchRecipeListingReportOutput,
  GenerateInvoicesReportOutput,
  GenerateItemActivityReportOutput,
  GenerateItemsBySupplierReportOutput,
  GenerateItemsPriceUpdatedReportOutput,
  GenerateItemsReportOutput,
  GenerateOrdersReportOutput,
  GenerateProductionReportOutput,
  GeneratePurchaseValueReportOutput,
  GenerateRecipeListingReportOutput,
  GenerateStockMovementCountsReportOutput,
  GenerateStockMovementsReportOutput,
  GenerateStockValueReportOutput,
  GenerateSuppliersReportOutput,
  GenerateTransfersReportOutput,
  GenerateVarianceReportOutput,
  GenerateWastageReportOutput,
} from '../../contracts';

export interface ReportColumns {
  readonly qtyColumns?: Set<string>;
  readonly priceColumns?: Set<string>;
  readonly dateColumns?: Set<string>;
  readonly stringColumns?: Set<string>;
  readonly customHeaderStyles?: Map<string, FillPattern>;
}
export interface ExtraColumns {
  readonly itemCodeKeys?: string[];
  readonly optionalKeys?: string[];
  readonly booleanKeys?: string[];
}
export interface WorkSheetProps {
  name: string;
  columns: string[];
  nameMapper?: Map<string, string>;
  commit?: boolean;
}
export interface ReportDetailsOptions {
  hideSupplierAndCategory?: boolean;
  showCustomers?: boolean;
  commit?: boolean;
  dateSelectionType?: 'single' | 'range' | 'none';
}
export type GenerateReportsOutput =
  //--------------------------Inventory-----------------------------------
  | GenerateBranchRecipeListingReportOutput
  | GenerateItemActivityReportOutput
  | GenerateProductionReportOutput
  | GenerateRecipeListingReportOutput
  | GenerateStockMovementCountsReportOutput
  | GenerateStockMovementsReportOutput
  | GenerateStockValueReportOutput
  | GenerateTransfersReportOutput
  | GenerateVarianceReportOutput
  | GenerateWastageReportOutput
  //--------------------------Procurement----------------------------------
  | GenerateAllPurchasesReportOutput
  | GenerateInvoicesReportOutput
  | GenerateItemsBySupplierReportOutput
  | GenerateItemsPriceUpdatedReportOutput
  | GenerateItemsReportOutput
  | GenerateOrdersReportOutput
  | GeneratePurchaseValueReportOutput
  | GenerateSuppliersReportOutput;

export type GenerateReportOutputProps =
  | 'overview'
  | 'byItem'
  | 'byType'
  | 'byEvent'
  | 'byItemEvent'
  | 'byIngredient'
  | 'breakdown'
  | 'byIngredientEvent'
  | 'byTypeByLocation'
  //------procurement
  | 'category'
  | 'subCategory'
  | 'month'
  | 'location'
  | 'day'
  | 'grn'
  | 'byGrn'
  //------Cogs
  | 'cogsOverview'
  | 'cogsPerItem'
  | 'cogsPerCategory'
  | 'byLocation'
  | 'byParent';
