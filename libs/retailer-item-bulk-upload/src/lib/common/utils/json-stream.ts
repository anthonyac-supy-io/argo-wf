/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as fs from 'fs';

import * as JSONStream from 'JSONStream';


export function writeLargeArrayToStream<T>(
  largeArray: T[],
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const outputStream = fs.createWriteStream(outputPath);

    const jsonStream = JSONStream.stringify();

    jsonStream.pipe(outputStream);

    largeArray.forEach((item) => {
      jsonStream.write(item);
    });

    jsonStream.end();

    outputStream.on('finish', () => { 
      resolve();
    });

    outputStream.on('error', (err) => {
      reject(err);
    });
  });
}
