/* eslint-disable no-console */
import { PassThrough, Readable } from 'stream';

export const streamToByteArray = (stream: PassThrough): Promise<Buffer> => {
  console.log('before stream to byte');

  const result = new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
      console.log('chunk size %d', chunk.length);
    });
    stream.on('end', () => {
      const byteArray: Buffer = Buffer.concat(chunks);
      resolve(byteArray);
    });
    stream.on('error', (error: Error) => reject(error));
  });
  console.log('after stream to byte');

  return result;
};

export const byteArrayToStream = (byteArray: Buffer): Readable => {
  return convert(byteArray);
};

function convert(buf: Buffer, chunkSize?: number): Readable {
  if (typeof buf === 'string') {
    buf = Buffer.from(buf, 'utf8');
  }

  if (!Buffer.isBuffer(buf)) {
    throw new TypeError(
      `"buf" argument must be a string or an instance of Buffer`
    );
  }

  const reader = new Readable();
  const hwm = reader.readableHighWaterMark;

  if (
    !chunkSize ||
    typeof chunkSize !== 'number' ||
    chunkSize < 1 ||
    chunkSize > hwm
  ) {
    chunkSize = hwm;
  }

  const len = buf.length;
  let start = 0;

  reader._read = function () {
    while (reader.push(buf.subarray(start, (start += chunkSize)))) {
      if (start >= len) {
        reader.push(null);

        break;
      }
    }
  };

  return reader;
}
