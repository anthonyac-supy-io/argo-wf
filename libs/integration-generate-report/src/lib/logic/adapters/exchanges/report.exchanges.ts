import { GenerateReportInput } from '../../dtos';
import { GenerateInventoryReportsOutput } from '../../dtos/report.output';

export interface GenerateReportSheetDataPayload {
  readonly overview?: Record<string, unknown>[];
  readonly byItem?: Record<string, unknown>[];
  readonly byType?: Record<string, unknown>[];
  readonly byEvent?: Record<string, unknown>[];
  readonly byItemEvent?: Record<string, unknown>[];
  readonly byIngredient?: Record<string, unknown>[];
  readonly breakdown?: Record<string, unknown>[];
  readonly byIngredientEvent?: Record<string, unknown>[];
  readonly byTypeByLocation?: Record<string, unknown>[];
}

export interface GenerateReportSheetsPayload {
  readonly input: GenerateReportInput;
  readonly data: GenerateReportSheetDataPayload;
}
export interface UploadReportPayload {
  readonly input: GenerateReportInput;
  readonly data: Buffer;
}
export type GenerateReportSheetsResponse = Buffer;
export type FetchReportDataPayload = GenerateReportInput;
export type FetchReportDataResponse = GenerateInventoryReportsOutput;
export type UploadReportResponse = string;
export type ReleaseLockDataPayload = GenerateReportInput;