import path from 'path';
import { PassThrough } from 'stream';
import { stream, Workbook } from '@dima-supy-io/exceljs';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { RedisClusterService } from '@supy.api/redis';

import { AllReportType } from '../../common';
import { ReportsExcelInteractor } from '../abstract';
import {
  ExtraColumns,
  GenerateReportsOutput,
  ReportColumns,
  reportColumnsMap,
  reportsColumnsMap,
  reportsDetailsOptionsMap,
  reportsExtraColumnsMap,
} from '../components';
import { GenerateReportInput, GenerateReportSheetsInput } from '../dtos';
import WorkbookWriter = stream.xlsx.WorkbookWriter;
import {
  DEFAULT_WEBSOCKET_SERVER,
  WebSocketServer,
} from '@supy.api/websockets';

import { GCloudStorageService } from '../services';

const THREE_HOURS_IN_MINUTES = 60 * 3;

@Injectable()
export class GenerateReportSheetsInteractor extends ReportsExcelInteractor {
  constructor(
    private readonly redisClusterService: RedisClusterService,
    private readonly gStorageService: GCloudStorageService,
    @Inject(DEFAULT_WEBSOCKET_SERVER)
    private readonly websocketServer: WebSocketServer
  ) {
    super();
  }

  protected sanitizeExcelRow<T>(row: T): T {
    return;
  }

  async execute({ reportId, data }: GenerateReportSheetsInput): Promise<void> {
    Logger.log('inside generate report interactor');

    const redisResponse = await this.redisClusterService.get(
      `workflow:report:generate:${reportId}`
    );

    if (!redisResponse) {
      throw new Error('Could Not Fetch Data From Redis');
    }

    const input = JSON.parse(redisResponse as string) as GenerateReportInput;
    const reportColumns: ReportColumns = reportColumnsMap.get(
      input.reportType as unknown as AllReportType
    );

    const reportData = this.transformReportDataForExcel(
      data as unknown as GenerateReportsOutput,
      input.reportType as unknown as AllReportType,
      reportColumns
    );

    const useStream = true;
    const reportDetailsOption = {
      commit: useStream,
      ...(reportsDetailsOptionsMap.get(
        input.reportType as unknown as AllReportType
      ) ?? {
        hideSupplierAndCategory: true,
      }),
    };

    const stream = new PassThrough();
    const options = {
      stream,
      useStyles: true,
      useSharedStrings: false,
    };
    const workbook = useStream ? new WorkbookWriter(options) : new Workbook();

    Logger.log('before generateRetailerReportDetailsSheet ');
    this.generateRetailerReportDetailsSheet(
      input,
      workbook,
      reportDetailsOption
    );
    Logger.log('after generateRetailerReportDetailsSheet ');

    for (const property in reportData) {
      if (Object.prototype.hasOwnProperty.call(reportData, property)) {
        Logger.log('before mapping');

        const key = property as keyof GenerateReportsOutput;
        const tabData = reportData[key];

        if (key === ('grn' as keyof GenerateReportsOutput)) {
          this.generateGrnSheet(
            tabData as unknown[],
            workbook,
            reportDetailsOption.commit,
            reportColumns
          );

          continue;
        }

        const sheetProps = reportsColumnsMap
          .get(input.reportType as unknown as AllReportType)
          .get(key);
        Logger.log('before createWorkSheet');
        this.createWorksheet(
          workbook,
          sheetProps.name,
          tabData,
          sheetProps.columns,
          sheetProps.nameMapper,
          reportDetailsOption.commit,
          reportColumns
        );
        Logger.log('after createWorkSheet');
      }
    }

    if (useStream) {
      Logger.log('Before commit');
      void (workbook as WorkbookWriter).commit();
      Logger.log('After commit');

      const filePath = path
        .join(
          process.env.GCLOUD_STORAGE_REPORTS_BASE_PATH,
          input.retailer.id,
          `${input.reportCategory}_${
            input.reportType
          }_${new Date().toISOString()}.xlsx`
        )
        .split(path.sep)
        .join('/');
      const uploadStream = this.gStorageService.storeFileStream(
        stream,
        {
          bucketName: process.env.GCLOUD_STORAGE_BUCKET_NAME,
          filePath,
        },
        null,
        { createdBy: input.submittedBy.id }
      );

      await this.gStorageService.streamToPromise(uploadStream);

      const signedUrl = await this.gStorageService.getSignedUrl({
        bucketName: process.env.GCLOUD_STORAGE_BUCKET_NAME,
        filePath,
        expireFromDate: new Date(),
        urlMinutesLifetime: THREE_HOURS_IN_MINUTES,
      });

      Logger.log('url', signedUrl);
      await this.websocketServer.dispatch(
        `private-cache-report-generate-workflow-${input.submittedBy.id}`,
        'report-generate-workflow.success',
        {
          status: 'finalizing',
          message: {
            message: `${input.reportType} Report Generated Successfully. To maintain accuracy, the report will be available for up to 3 hours.`,
            reportType: input.reportType,
            retailerId: input.retailer.id,
            reportUrl: signedUrl,
          },
          date: Date.now(),
          uuid: reportId,
        }
      );
    } else {
      //TODO: implement logic for uploading directly instead of streaming
      // const user = await this.getUserRepository.getUser(input.submittedBy.id);
      // const out = (await workbook.xlsx.writeBuffer()) as Buffer;
      // await this.gStorageService.storeFile(
      //   out,
      //   {
      //     bucketName: process.env.GCLOUD_STORAGE_BUCKET_NAME,
      //     filePath: path.join(
      //       process.env.GCLOUD_STORAGE_REPORTS_BASE_PATH,
      //       input.retailer.id,
      //       `${input.reportCategory}_${input.reportType}_${new Date().toISOString()}.xlsx`,
      //     ),
      //   },
      //   null,
      //   { createdBy: user.id },
      // );
    }
    // await storeBufferToFile(reportData, path);
  }

  private transformReportDataForExcel(
    data: GenerateReportsOutput,
    reportType: AllReportType,
    reportColumns: ReportColumns
  ): GenerateReportsOutput {
    const newData: Record<string, unknown> = {};
    const extraColumns: ExtraColumns = reportsExtraColumnsMap.get(reportType);

    for (const property in data) {
      if (Object.prototype.hasOwnProperty.call(data, property)) {
        const key = property as keyof GenerateReportsOutput;
        const val = data[key].map((row: unknown) =>
          this.sanitizeTheExcelRow<typeof row>(row, extraColumns, {
            qtyColumns: reportColumns?.qtyColumns ?? this.qtyColumns,
            priceColumns: reportColumns?.priceColumns ?? this.priceColumns,
            dateColumns: reportColumns?.dateColumns ?? this.dateColumns,
            stringColumns: reportColumns?.stringColumns ?? this.stringColumns,
          })
        );
        newData[key] = val;
      }
    }

    return newData as GenerateReportsOutput;
  }

  protected sanitizeTheExcelRow<T>(
    row: T,
    extraColumns: ExtraColumns,
    reportColumns: ReportColumns
  ): T {
    const excelRow = JSON.parse(JSON.stringify(row)) as {
      [key: string]: string | number | Date;
    };

    for (const key of Object.keys(row)) {
      const propVal = row[key as keyof T];
      const numberVal = Number(propVal);

      if (reportColumns.stringColumns.has(key)) {
        excelRow[key] = (propVal && String(propVal)) || '';
      } else if (extraColumns?.itemCodeKeys?.includes(key)) {
        excelRow[key] = `${propVal as unknown as string}`;
      } else if (extraColumns?.booleanKeys.includes(key)) {
        excelRow[key] = propVal ? 'Yes' : 'No';
      } else if (
        (!extraColumns?.optionalKeys?.includes(key) ?? true) &&
        (numberVal === 0 || propVal) &&
        !Number.isNaN(numberVal) &&
        !key.toLowerCase().includes('code')
      ) {
        excelRow[key] = numberVal;
      } else if (
        (!extraColumns?.optionalKeys?.includes(key) ?? true) &&
        !propVal
      ) {
        excelRow[key] = null;
      } else if (reportColumns.dateColumns.has(key)) {
        excelRow[key] = new Date(propVal as unknown as string);
      }
    }

    return excelRow as unknown as T;
  }
}
