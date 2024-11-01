import { Injectable } from '@nestjs/common';

import { ClientAdapter } from '@supy/common';

import {
  FetchReportDataPayload,
  FetchReportDataResponse,
  GenerateReportSheetsPayload,
  GenerateReportSheetsResponse,
  UploadReportPayload,
  UploadReportResponse,
} from './exchanges';

@Injectable()
export class ReportAdapter {
  constructor(private readonly client: ClientAdapter) {}

  async fetchReportData(
    payload: FetchReportDataPayload
  ): Promise<FetchReportDataResponse> {
    return await this.client.coreTCP.sendAsync<
      FetchReportDataResponse,
      Omit<FetchReportDataPayload, 'retailer' | 'locations'> & {
        retailer: { id: string };
        locations: { id: string }[];
      },
      'reports.fetch'
    >('reports.fetch', {
      ...payload,
      lockData: undefined,
      country: undefined,
      retailer: { id: payload.retailer.id },
      locations: payload.locations.map((loc) => ({ id: loc.id })),
    });
  }

  async generateReportData(
    payload: GenerateReportSheetsPayload
  ): Promise<GenerateReportSheetsResponse> {
    return await this.client.coreTCP.sendAsync<
      GenerateReportSheetsResponse,
      GenerateReportSheetsPayload,
      'reports.generate-sheets'
    >('reports.generate-sheets', {
      ...payload,
      input: { ...payload.input, lockData: undefined },
    });
  }

  async uploadReport(
    payload: UploadReportPayload
  ): Promise<UploadReportResponse> {
    return await this.client.coreTCP.sendAsync<
      UploadReportResponse,
      UploadReportPayload,
      'reports.upload'
    >('reports.upload', {
      ...payload,
      input: { ...payload.input, lockData: undefined },
    });
  }
}

// import { Inject, Injectable } from '@nestjs/common';

// import { TcpClientProxy } from '@supy.api/microservices';

// import { TCP_CLIENT_CORE } from '../../common';
// import {
//   FetchReportDataPayload,
//   FetchReportDataResponse,
//   GenerateReportSheetsPayload,
//   GenerateReportSheetsResponse,
//   UploadReportPayload,
//   UploadReportResponse,
// } from './exchanges';
// import { Observable } from 'rxjs';

// @Injectable()
// export class ReportAdapter {
//   constructor(
//     @Inject(TCP_CLIENT_CORE) private readonly coreClient: TcpClientProxy
//   ) {}

//   async fetchReportData(
//     payload: FetchReportDataPayload
//   ): Promise<FetchReportDataResponse> {
//     return await this.coreClient.sendAsync<
//       FetchReportDataResponse,
//       FetchReportDataPayload,
//       'reports.fetch'
//     >('reports.fetch', {...payload,lockData:undefined});
//   }

//    generateReportData(
//     payload: GenerateReportSheetsPayload
//   ): Observable<GenerateReportSheetsResponse> {
//     return this.coreClient.send<
//       GenerateReportSheetsResponse,
//       GenerateReportSheetsPayload,
//       'reports.generate-sheets'
//     >('reports.generate-sheets',  {...payload,input:{...payload.input,lockData:undefined}});
//   }

//   async uploadReport(
//     payload: UploadReportPayload
//   ): Promise<UploadReportResponse> {

//     return await this.coreClient.sendAsync<
//       UploadReportResponse,
//       UploadReportPayload,
//       'reports.upload'
//     >('reports.upload', {
//       ...payload,
//       input: { ...payload.input, lockData: undefined },
//     });
//   }
// }
