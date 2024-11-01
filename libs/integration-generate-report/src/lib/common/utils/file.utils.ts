/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as fs from 'fs';
import { Stream } from 'stream';

import * as JSONStream from 'JSONStream';

export async function streamJsonToFile<T>(
  jsonObject: T,
  filePath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const outputStream = fs.createWriteStream(filePath);
    const jsonStream = JSONStream.stringify();
    outputStream.on('error', reject);
    jsonStream.on('error', reject);
    outputStream.on('finish', () => {
      resolve();
    });
    jsonStream.pipe(outputStream);
    jsonStream.write(jsonObject);
    jsonStream.end();
  });
}

export async function storeBufferToFile(
  buffer: Buffer,
  filePath: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    writeStream.write(buffer);
    writeStream.end();
    writeStream.on('finish', () => {
      resolve();
    });
    writeStream.on('error', (err) => {
      console.log(err);
      reject(err);
    });
  });
}
export async function storeStreamToFile(
  stream: Stream,
  filePath: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    stream.pipe(writeStream);
    writeStream.on('close', function () {
      console.log('All done!');
      resolve();
    });
    writeStream.on('error', (err) => {
      console.log(err);
      reject();
    });
  });
}
// export async function storeBufferToFile(
//   buffer: Observable<Buffer>,
//   filePath: string
// ): Promise<void> {
//   return new Promise<void>((resolve, reject) => {
//     const writeStream = fs.createWriteStream(filePath);
//     writeStream.on('error',reject)
//     writeStream.on('finish',resolve)
//     buffer.subscribe({
//       next: (chunk) => {
//         writeStream.write(chunk);
//       },
//       error: (err) => {
//         console.log(err);
//         reject(err);
//       },
//       complete: () => {
//         writeStream.end();
//       },
//     });
//   });
// }
export async function streamFileToJson<T>(filePath: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const inputStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const jsonStream = JSONStream.parse('*');

    inputStream.on('error', reject);
    jsonStream.on('error', reject);

    jsonStream.on('data', (jsonObject: { payload: T }) => {
      resolve(jsonObject.payload);
    });

    inputStream.pipe(jsonStream);
  });
}
export function readFileAsBuffer(filePath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
        console.log('read buffer error', err);

        return null;
      }
      console.log('read buffer data');
      resolve(data);
    });
  });
}
