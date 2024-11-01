import {
  AllReportTypeEnum,
  Branch,
  Country,
  IdType,
  ReportCategoryEnum,
  Retailer,
} from '../../common';
import { GenerateReportSheetDataPayload } from '../adapters';

export interface GenerateReportInput {
  readonly retailer: Retailer;
  readonly locations?: Branch[];
  readonly outlets?: IdType[];
  readonly customers?: IdType[];
  readonly suppliers?: IdType[];
  readonly categories?: IdType[];
  readonly recipeCategories?: IdType[];
  readonly categoryNames?: string[];
  readonly supplierNames?: string[];
  readonly customerNames?: string[];
  readonly from?: number;
  readonly to?: number;
  readonly submittedBy: IdType;
  readonly reportType: AllReportTypeEnum;
  readonly reportCategory: ReportCategoryEnum;
  readonly country?: Country;
  readonly lockData: { key: string; hash: string };
}
export interface GenerateReportSheetsInput {
  reportId: string;
  data: GenerateReportSheetDataPayload;
}
export interface UploadReportInput {
  reportId: string;
  data: Buffer;
}
