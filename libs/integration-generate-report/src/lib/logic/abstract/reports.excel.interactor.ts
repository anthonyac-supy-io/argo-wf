import {
  Alignment,
  Border,
  Borders,
  BorderStyle,
  Cell,
  Column,
  FillPattern,
  Row,
  Style,
  ValueType,
  Workbook,
  Worksheet,
} from '@dima-supy-io/exceljs';

// import { noLimit, query, where } from '@supy.api/query';
// import { IOutletsRepository, OutletQuery } from '@supy/outlets/core';
// import {
//   GenerateReportGrnRowOutput,
//   GenerateRetailerReportInput,
// } from '@supy/reports/contracts';
// import { AllReportTypeEnum } from '@supy/reports/core';
// import {
//   IGetBranchesRepository,
//   IGetRetailerRepository,
// } from '@supy/retailers/contracts';
// import { Branch } from '@supy/retailers/core';
// import { ISettingsRepository } from '@supy/settings/contracts';
// import { Settings } from '@supy/settings/core';
import {
  AllReportType,
  InventoryReportTypeEnum,
  ProcurementReportTypeEnum,
  SalesReportTypeEnum,
} from '../../common';
import { ReportColumns } from '../components';
import { GenerateReportGrnRowOutput } from '../contracts';
import { GenerateReportInput } from '../dtos';

interface CellFormatOptions {
  readonly qtyCols?: Set<string>;
  readonly currencyCols?: Set<string>;
  readonly dateCols?: Set<string>;
}

interface ReportDetailsOptions {
  hideSupplierAndCategory?: boolean;
  showCustomers?: boolean;
  commit?: boolean;
  dateSelectionType?: 'single' | 'range' | 'none';
}

const DEFAULT_TIMEZONE_CODE = 'Asia/Dubai';

const DEFAULT_CELL_FONT = {
  name: 'Calibri',
  family: 2,
  bold: false,
  size: 11,
};

const HEADER_BACKGROUND_COLOR = 'E5E8F4';

const ACRONYMS_LIST = ['PO', 'FOC', 'COGS', 'QTY'];

export abstract class ReportsExcelInteractor {
  private readonly descriptionMap = new Map<AllReportType, string>([
    [
      ProcurementReportTypeEnum.PurchaseValue,
      'Purchase value per location with breakdowns per item category, month & day.',
    ],
    [
      ProcurementReportTypeEnum.Items,
      'Ordering & receiving data per item across suppliers with breakdowns per location, month & day.',
    ],
    [
      ProcurementReportTypeEnum.ItemsBySupplier,
      'Ordering & receiving data per supplier item with breakdowns per location, month & day.',
    ],
    [
      ProcurementReportTypeEnum.Suppliers,
      'Ordering & receiving data per supplier with breakdowns per item category, month & location.',
    ],
    [
      ProcurementReportTypeEnum.ItemsByPriceChanges,
      'List of price update events.',
    ],
    [ProcurementReportTypeEnum.ItemsByPriceChanges, 'List of Orders.'],
    [ProcurementReportTypeEnum.ItemsByPriceChanges, 'List of Invoices.'],
    [
      ProcurementReportTypeEnum.CentralKitchen,
      'Ordering, shipping and receiving data for Central Kitchen locations, with breakdowns per Order, per Item and per GRN.',
    ],
    [
      ProcurementReportTypeEnum.CentralKitchenB2B,
      'Ordering, shipping and receiving data for Central Kitchen between businesses, with breakdowns per Item ',
    ],
    [
      InventoryReportTypeEnum.StockMovementBetweenCounts,
      'Movement of stock, specifically between two stock counts, represented (1) By Location and (2) By Item',
    ],
    [
      InventoryReportTypeEnum.StockMovements,
      'Movement of stock in a given time period, represented (1) By Location and (2) By Item',
    ],
    [
      InventoryReportTypeEnum.Variance,
      'Variance in stock after a selected stock-count day, represented (1) By Location and (2) By Item',
    ],
    [
      InventoryReportTypeEnum.ItemActivity,
      'Item stock movement breakdown per Inventory event',
    ],
    [
      InventoryReportTypeEnum.StockValue,
      'Stock Value per Item at the end of a selected date and location',
    ],
    [
      InventoryReportTypeEnum.Wastage,
      'Wastage events, represented (1) By Item, (2) By Ingredient, (3) By Wastage Type, (4) By Wastage Type Per Location, (5) By Event Item, and (6) By Event Ingredient',
    ],
    [
      InventoryReportTypeEnum.Production,
      'Production events, represented (1) By Event, (2) By Ingredient, and (3) Breakdown',
    ],
    [
      InventoryReportTypeEnum.Transfer,
      'Transfer events, represented (1) By Location and (2) By Event',
    ],
    [
      InventoryReportTypeEnum.RecipeListing,
      'Listing of recipes, including details of average recipe costing and ingredient costing, for selected branches',
    ],
    [
      InventoryReportTypeEnum.BranchRecipeListing,
      'Listing of recipes, including details of recipe costing and ingredient costing, for a selected branch',
    ],
    [
      SalesReportTypeEnum.RecipeSales,
      'Sales of recipes (including recipe costing and ingredient costing, represented by (1) By Recipe and (2) By Location',
    ],
    [
      SalesReportTypeEnum.CostPerLocation,
      'Total Cost for a selected Location, represented (1) overall, (2) per item, and (3) per category',
    ],
    [SalesReportTypeEnum.CostOverview, 'Total Cost across multiple Locations'],
  ]);

  protected readonly qtyColumns: Set<string> = new Set<string>([]);
  protected readonly priceColumns: Set<string> = new Set<string>([]);
  protected readonly dateColumns: Set<string> = new Set<string>(['date']);
  protected readonly stringColumns: Set<string> = new Set<string>([
    'itemCode',
    'code',
    'LPO',
    'PO',
    'invoiceNumber',
  ]);

  protected abstract sanitizeExcelRow<T>(row: T): T;

  generateRetailerReportDetailsSheet(
    input: GenerateReportInput,
    workbook: Workbook,
    options?: ReportDetailsOptions
  ): Worksheet {
    const {
      hideSupplierAndCategory,
      showCustomers,
      commit,
      dateSelectionType = 'range',
    } = options ?? {};
    // const retailer = await this.retailerRepository.getRetailer(
    //   input.retailer.id
    // );
    // const settings = await this.settingsRepository.getSettings(
    //   query<Settings>(where('retailer.id', 'eq', input.retailer.id), noLimit())
    // );
    // const locationIds = input.locations?.length
    //   ? input.locations.map(({ id }) => id)
    //   : [];

    const categoryNames = input.categoryNames?.length
      ? input.categoryNames
      : [];
    const supplierNames = input.supplierNames?.length
      ? input.supplierNames
      : [];
    const customerNames = input.customerNames?.length
      ? input.customerNames
      : [];

    // const locations = await this.locationsRepository.getBranches(
    //   query<Branch>(where('id', 'in', locationIds), noLimit())
    // );
    // const outletIds = locations.data?.length
    //   ? locations.data.map(({ outlet }) => outlet.id)
    //   : [];

    // const outlets = await this.outletsRepository.getOutlets(
    //   query<OutletQuery>(where('id', 'in', outletIds), noLimit())
    // );

    const locationRows = input.locations.map((location) => {
      // const outlet = outlets.data.find(
      //   ({ id }) => id.get() === location.outlet.id
      // ).name.en;

      return {
        retailer: input.retailer.name,
        outlet: location.outlet.name.en,
        location: location.name,
      };
    });

    const supplierRows = supplierNames;
    const categoryRows = categoryNames;
    const customerRows = customerNames;

    const mainSheet = workbook.addWorksheet('Report Data');

    const now = new Date();
    const from = new Date(input.from);
    const to = new Date(input.to);

    const ianaTimeZone = input.country?.ianaTimeZone ?? DEFAULT_TIMEZONE_CODE;
    const fromUTC = this.getDateString(from, ianaTimeZone, true);
    const toUTC = this.getDateString(to, ianaTimeZone, true);
    const nowUTC = this.getDateString(now, ianaTimeZone, true);
    const fromFormatted = this.getDateString(from, ianaTimeZone);
    const toFormatted = this.getDateString(
      to,
      ianaTimeZone,
      false,
      !!(dateSelectionType === 'single')
    );
    const nowFormatted = this.getDateString(now, ianaTimeZone);

    const dateRows: string[][] = [];

    switch (dateSelectionType) {
      case 'none': {
        dateRows.push([], []);

        break;
      }

      case 'single': {
        dateRows.push([], ['Selected Date:', `${toFormatted} (Local)`]);

        break;
      }

      case 'range':
      default: {
        dateRows.push(
          ['Report Date From:', `${fromFormatted} (Local)`, '', fromUTC],
          ['Report Date To:', `${toFormatted} (Local)`, '', toUTC]
        );

        break;
      }
    }

    const reportDetailsData = [
      ['Report Details'],
      [],
      ['Report Type:', input.reportType],
      [
        'Report Description:',
        this.descriptionMap.get(input.reportType as unknown as AllReportType),
      ],
      ['Requested On:', `${nowFormatted} (Local)`, '', nowUTC],
      ...dateRows,
      [],
      [],
      [
        `All financial information shown on this sheet is in ${
          input.country?.currency ?? 'AED'
        }`,
      ],
      [],
    ];

    /**
     * Set Sheet Data
     */

    reportDetailsData.forEach((row) => {
      mainSheet.addRow(row);
    });

    const retailerListData = showCustomers
      ? customerRows.map((customerName) => [customerName, '', ''])
      : locationRows.map((row) => [row.outlet, row.location, '']);
    const supplierData = supplierRows;
    const categoryData = categoryRows;

    // Add data for Retailer Details, Suppliers, and Categories to the main worksheet
    const headersArray = ['Retailer Details', input.retailer.name];
    const subHeadersArray = showCustomers
      ? ['Customers', '', '']
      : ['Branch', 'Location', ''];

    if (!hideSupplierAndCategory) {
      subHeadersArray.push(...['Suppliers', '', 'Categories']);
    }

    [headersArray, [], subHeadersArray].forEach((row) => {
      mainSheet.addRow(row);
    });

    let additionalInfo: string[][] = [];

    if (hideSupplierAndCategory) {
      additionalInfo = retailerListData;
    } else {
      const maxLength = Math.max(
        retailerListData.length,
        supplierData.length,
        categoryData.length
      );
      const iterableArray = new Array(maxLength).fill(0);
      iterableArray.forEach((_, index) => {
        additionalInfo.push([
          ...(retailerListData[index] ?? ['', '', '']),
          supplierData[index] ?? '',
          '',
          categoryData[index] ?? '',
        ]);
      });
    }

    additionalInfo.forEach((row) => {
      mainSheet.addRow(row);
    });

    /**
     * Set Sheet Styling
     */

    range(3, 11).forEach((row) =>
      mainSheet.getRow(row).eachCell((cell) => (cell.font = DEFAULT_CELL_FONT))
    );

    const headerRow = mainSheet.getRow(1);
    const headerFill: FillPattern = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: HEADER_BACKGROUND_COLOR },
    };
    const headerBorder: Partial<Borders> = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' },
    };

    headerRow.height = 25;

    headerRow.eachCell(function (cell, colNumber) {
      cell.font = { ...DEFAULT_CELL_FONT, size: 14, bold: true };
      cell.fill = headerFill;
      cell.border = headerBorder;
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    });

    mainSheet.mergeCells('A1:F1');

    mainSheet.getCell('A10').font = {
      name: 'Calibri Italic',
      family: 2,
      size: 14,
      italic: true,
    };

    ['A3', 'A4', 'A5', 'A6', 'A7', 'A12'].forEach(
      (cell) =>
        (mainSheet.getCell(cell).font = { ...DEFAULT_CELL_FONT, bold: true })
    );

    mainSheet.columns.forEach((column) => {
      column.width = 25;
    });

    mainSheet
      .getRow(14)
      .eachCell((cell) => (cell.font = { ...DEFAULT_CELL_FONT, bold: true }));

    mainSheet.getCell('A12').fill = headerFill;
    this.createOuterBorder(mainSheet, { col: 1, row: 12 }, { col: 1, row: 12 });
    this.createOuterBorder(mainSheet, { col: 1, row: 12 }, { col: 2, row: 12 });
    this.createOuterBorder(mainSheet, { col: 1, row: 3 }, { col: 6, row: 7 });
    mainSheet.getCell('A14').fill = headerFill;

    if (showCustomers) {
      this.createOuterBorder(
        mainSheet,
        { col: 1, row: 14 },
        { col: 1, row: 14 }
      );
      this.createOuterBorder(
        mainSheet,
        { col: 1, row: 14 },
        { col: 1, row: 14 + retailerListData.length }
      );
    } else {
      mainSheet.getCell('B14').fill = headerFill;

      this.createOuterBorder(
        mainSheet,
        { col: 1, row: 14 },
        { col: 2, row: 14 }
      );
      this.createOuterBorder(
        mainSheet,
        { col: 1, row: 14 },
        { col: 2, row: 14 + retailerListData.length }
      );
    }

    if (!hideSupplierAndCategory) {
      mainSheet.getCell('D14').fill = headerFill;
      mainSheet.getCell('F14').fill = headerFill;

      this.createOuterBorder(
        mainSheet,
        { col: 4, row: 14 },
        { col: 4, row: 14 }
      );
      this.createOuterBorder(
        mainSheet,
        { col: 4, row: 14 },
        { col: 4, row: 14 + supplierData.length }
      );

      this.createOuterBorder(
        mainSheet,
        { col: 6, row: 14 },
        { col: 6, row: 14 }
      );
      this.createOuterBorder(
        mainSheet,
        { col: 6, row: 14 },
        { col: 6, row: 14 + categoryData.length }
      );
    }

    mainSheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
      if (rowNumber === 1) {
        return;
      }

      row.height = 16;
    });

    if (commit) {
      mainSheet.eachRow(
        { includeEmpty: true },
        async (row: Row) => await row.commit()
      );
    }

    return mainSheet;
  }

  generateGrnSheet<T>(
    data: T[],
    workbook: Workbook,
    commit?: boolean,
    reportColumns?: ReportColumns
  ): void {
    const grnSheet = workbook.addWorksheet('By Grn', {
      views: [{ state: 'frozen', ySplit: 1 }],
    });
    grnSheet.columns = [
      'invoiceNumber',
      'supplierName',
      'outlet',
      'location',
      'PO',
      'status',
      'documentType',
      'documentDate',
      'bookingDate',
      'isPaid',
      'paymentDate',
      'subTotal',
      'invoiceDiscount',
      'otherFees',
      'total',
      'taxAmount',
      'grandTotal',
      'totalItemDiscount',
      'totalFOCValue',
    ].map((header) => this.getTransformedHeader(header));

    data.forEach((row) => {
      grnSheet.addRow(row);
    });
    this.updateSheetStyles(grnSheet, reportColumns);

    if (commit) {
      grnSheet.eachRow(
        { includeEmpty: true },
        async (row: Row) => await row.commit()
      );
    }
  }

  protected sanitizeGrnExcelRow(
    row: GenerateReportGrnRowOutput
  ): GenerateReportGrnRowOutput {
    const excelRow = JSON.parse(JSON.stringify(row)) as {
      [key: string]: string | number;
    };
    const toFixed2Keys = [
      'invoiceDiscount',
      'otherFees',
      'subTotal',
      'grandTotal',
      'totalItemDiscount',
      'totalFOCValue',
      'total',
      'taxAmount',
    ];

    for (const key of Object.keys(row)) {
      const propVal = row[key as keyof GenerateReportGrnRowOutput];
      const numberVal = Number(propVal);

      if (!Number.isNaN(numberVal)) {
        excelRow[key] = toFixed2Keys.includes(key)
          ? parseFloat(numberVal.toFixed(2))
          : numberVal;
      }
    }

    return excelRow as unknown as GenerateReportGrnRowOutput;
  }

  protected createWorksheet(
    workbook: Workbook,
    name: string,
    data: unknown[],
    columns: string[],
    nameMapper?: Map<string, string>,
    commit?: boolean,
    reportColumns?: ReportColumns
  ): Worksheet {
    const worksheet = workbook.addWorksheet(name, {
      views: [{ state: 'frozen', ySplit: 1 }],
    });
    worksheet.columns = columns.map((header) =>
      nameMapper?.has(header)
        ? { header: nameMapper.get(header), key: header }
        : this.getTransformedHeader(header)
    );
    data.forEach((row) => {
      worksheet.addRow(row);
    });
    this.updateSheetStyles(worksheet, reportColumns);

    return worksheet;
  }

  protected getDateString(
    date: Date,
    ianaTimeZone: string,
    getUTC?: boolean,
    getDateOnly?: boolean
  ): string {
    if (getUTC) {
      return date.toUTCString();
    } else {
      return date.toLocaleString('en-GB', {
        timeZone: ianaTimeZone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        ...(getDateOnly
          ? {}
          : {
              hour: '2-digit',
              minute: '2-digit',
            }),
      });
    }
  }

  protected updateSheetStyles(sheet: Worksheet, reportColumns?: ReportColumns) {
    const headerRow = sheet.getRow(1);
    const headerFill: FillPattern = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: HEADER_BACKGROUND_COLOR },
    };
    const headerBorder: Partial<Borders> = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    headerRow.height = 18;

    const formatCellOptions: CellFormatOptions = {
      qtyCols: reportColumns?.qtyColumns ?? this.qtyColumns,
      currencyCols: reportColumns?.priceColumns ?? this.priceColumns,
      dateCols: reportColumns?.dateColumns ?? this.dateColumns,
    };

    headerRow.eachCell((cell, colNumber) => {
      cell.font = { ...DEFAULT_CELL_FONT, bold: true };
      cell.fill = headerFill;
      cell.border = headerBorder;
      cell.alignment = {
        vertical: 'middle',
      };
    });

    sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber === 1) {
        return;
      }

      row.eachCell((cell: Cell, colNumber) => {
        cell.font = DEFAULT_CELL_FONT;

        const col: Column = sheet.getColumn(colNumber);

        if (this.stringColumns.has(col.key)) {
          return;
        }

        formatCell(cell, col.key, formatCellOptions);
      });

      row.height = 18;
    });

    sheet.columns.forEach((column) => {
      let maxLength = 0;
      const customHeaderStyle = reportColumns?.customHeaderStyles?.get(
        column.key
      );

      column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (customHeaderStyle && rowNumber === 1) {
          cell.style.fill = customHeaderStyle;
        }

        const columnLength = cell.value ? cell.value.toString().length + 3 : 10;

        if (cell.type === ValueType.Date) {
          maxLength = 20;
        } else if (columnLength < 30 && columnLength > maxLength) {
          maxLength = columnLength + 3;
        }
      });
      column.width = column.key === '' ? 4 : maxLength < 10 ? 10 : maxLength;
    });
  }

  protected getTransformedHeader(key: string): Partial<Column> {
    const header = camelCaseToTitleCaseWithAcronyms(key);

    return { header, key };
  }

  private createOuterBorder(
    worksheet: Worksheet,
    start = { row: 1, col: 1 },
    end = { row: 1, col: 1 },
    borderWidth: BorderStyle = 'medium'
  ) {
    const borderStyle: Partial<Border> = {
      style: borderWidth,
    };

    for (let i = start.row; i <= end.row; i++) {
      const leftBorderCell = worksheet.getCell(i, start.col);
      const rightBorderCell = worksheet.getCell(i, end.col);
      leftBorderCell.border = {
        ...leftBorderCell.border,
        left: borderStyle,
      };
      rightBorderCell.border = {
        ...rightBorderCell.border,
        right: borderStyle,
      };
    }

    for (let i = start.col; i <= end.col; i++) {
      const topBorderCell = worksheet.getCell(start.row, i);
      const bottomBorderCell = worksheet.getCell(end.row, i);
      topBorderCell.border = {
        ...topBorderCell.border,
        top: borderStyle,
      };
      bottomBorderCell.border = {
        ...bottomBorderCell.border,
        bottom: borderStyle,
      };
    }
  }
}

function camelCaseToTitleCaseWithAcronyms(
  input: string,
  acronyms: string[] = ACRONYMS_LIST
) {
  const acronymPattern = acronyms.join('|');
  const pattern = new RegExp(
    `(${acronymPattern}|[A-Z]?[a-z]+)|[A-Z]+|[0-9]+`,
    'g'
  );

  const words = input.match(pattern) || [];

  const titleCaseWords = words.map((word) => {
    const isAcronym = acronyms.includes(word);

    return isAcronym
      ? word
      : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return titleCaseWords.join(' ');
}

function formatCell(
  cell: Cell,
  key: string,
  { qtyCols, currencyCols, dateCols }: CellFormatOptions
) {
  if (qtyCols?.has(key)) {
    formatQuantityCell(cell);
  } else if (currencyCols?.has(key)) {
    formatPriceCell(cell);
  } else if (dateCols?.has(key)) {
    cell.value === 0 ? (cell.value = '-') : formatDateCell(cell);
  }
}

/**
 * Sets number format for defined range of columns
 *
 * @param {Style} style - ExcelJS Style to assign alignment
 * @param {Alignment} [alignment] - column alignment. If nothing passed, will align to the right horizontally
 */
export function alignStyle(
  style: Partial<Style>,
  alignment: Partial<Alignment> = { horizontal: 'right' }
) {
  if (alignment) {
    style.alignment = alignment;
  }
}

/**
 * Sets number format for defined range of columns
 *
 * @param {Style} style - ExcelJS Style to update
 * @param {string} [format] - any Excel number format: "$0.00" or '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)'
 */
export function formatNumberColumn(style: Partial<Style>, format?: string) {
  if (format) {
    style.numFmt = format;
    alignStyle(style);
  }
}

/**
 * Sets percentage format for defined range of columns
 * Format is '0.00%' - display percentages with 2 decimal places.
 *
 * @param {Style} style - ExcelJS Style to update
 */
export function formatPercentageColumn(style: Partial<Style>) {
  const format = '0.00%';

  formatNumberColumn(style, format);
}

/**
 * Sets default quantity format for defined range of columns
 * Format is '#,##0.000' - display a thousands separator and 3 decimal places.
 *
 * @param {Style} style - ExcelJS Style to update
 */
export function formatQuantityCell(style: Partial<Style>) {
  const format = '#,##0.000';

  formatNumberColumn(style, format);
}

/**
 * Sets default price format for defined range of columns
 * Format is '#,##0.00' - display a thousands separator and 2 decimal places.
 *
 * @param {Style} style - ExcelJS Style to update
 */
export function formatPriceCell(style: Partial<Style>) {
  const format = '#,##0.00';

  formatNumberColumn(style, format);
}

/**
 * Sets default date format for defined range of columns
 * Format is 'dd-mmm-yy' - 07-Oct-22.
 *
 * @param {Style} style - ExcelJS Style to update
 */
export function formatDateCell(style: Partial<Style>) {
  const format = 'dd-mmm-yy';

  formatNumberColumn(style, format);
}

function range(start: number, end: number) {
  const arr: number[] = [];

  for (let i = start; i <= end; i++) {
    arr.push(i);
  }

  return arr;
}
