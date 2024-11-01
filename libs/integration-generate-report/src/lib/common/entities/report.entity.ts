export enum ReportCategoryEnum {
  Procurement = 'Procurement',
  Inventory = 'Inventory',
  SalesCOGS = 'SalesCOGS',
}

export enum ProcurementReportTypeEnum {
  Orders = 'Orders',
  Items = 'Items',
  ItemsBySupplier = 'ItemsBySupplier',
  ItemsByPriceChanges = 'ItemsByPriceChanges',
  PurchaseValue = 'PurchaseValue',
  Suppliers = 'Suppliers',
  SupplierStatement = 'SupplierStatement',
  Invoices = 'Invoices',
  AllPurchases = 'AllPurchases',
  CentralKitchen = 'CentralKitchen',
  CentralKitchenB2B = 'CentralKitchenB2B',
}

export enum SalesReportTypeEnum {
  CostOverview = 'CostOverview',
  CostPerLocation = 'CostPerLocation',
  RecipeSales = 'RecipeSales',
}

export enum InventoryReportTypeEnum {
  StockMovementBetweenCounts = 'StockMovementBetweenCounts',
  StockMovements = 'StockMovements',
  Variance = 'Variance',
  ItemActivity = 'ItemActivity',
  StockValue = 'StockValue',
  Wastage = 'Wastage',
  Transfer = 'Transfers',
  Production = 'Production',
  RecipeListing = 'RecipeListing',
  BranchRecipeListing = 'BranchRecipeListing',
}

export enum AllReportTypeEnum {
  Orders = 'Orders',
  Items = 'Items',
  ItemsBySupplier = 'ItemsBySupplier',
  ItemsByPriceChanges = 'ItemsByPriceChanges',
  PurchaseValue = 'PurchaseValue',
  Suppliers = 'Suppliers',
  SupplierStatement = 'SupplierStatement',
  Invoices = 'Invoices',
  AllPurchases = 'AllPurchases',
  CostOverview = 'CostOverview',
  CostPerLocation = 'CostPerLocation',
  StockMovementBetweenCounts = 'StockMovementBetweenCounts',
  StockMovements = 'StockMovements',
  Variance = 'Variance',
  ItemActivity = 'ItemActivity',
  StockValue = 'StockValue',
  Wastage = 'Wastage',
  Transfers = 'Transfers',
  Production = 'Production',
  RecipeSales = 'RecipeSales',
  RecipeListing = 'RecipeListing',
  BranchRecipeListing = 'BranchRecipeListing',
  CentralKitchen = 'CentralKitchen',
  CentralKitchenB2B = 'CentralKitchenB2B',
}
export type AllReportType =
  | ProcurementReportTypeEnum
  | SalesReportTypeEnum
  | InventoryReportTypeEnum;
