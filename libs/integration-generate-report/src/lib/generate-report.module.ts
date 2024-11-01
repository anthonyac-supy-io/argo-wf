import { Module } from '@nestjs/common';

import { GenerateReportErrorHandler } from './errors';
import {
  FetchReportDataInteractor,
  GenerateReportSheetsInteractor,
  ReleaseLockInteractor,
  UploadReportInteractor,
} from './logic';
import { ReportAdapter } from './logic/adapters';

@Module({
  controllers: [],
  providers: [
    FetchReportDataInteractor,
    GenerateReportSheetsInteractor,
    UploadReportInteractor,
    ReportAdapter,
    GenerateReportErrorHandler,
    ReleaseLockInteractor,
  ],
  exports: [
    FetchReportDataInteractor,
    GenerateReportSheetsInteractor,
    UploadReportInteractor,
    ReportAdapter,
    GenerateReportErrorHandler,
    ReleaseLockInteractor,
  ],
})
export class GenerateReportModule {}
