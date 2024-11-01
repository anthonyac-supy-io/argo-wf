import * as crypto from 'crypto';

export function hashObjectSha1(obj: unknown): string {
  const objStr = JSON.stringify(obj);
  const sha1 = crypto.createHash('sha1');
  sha1.update(objStr);

  const sha1Hash = sha1.digest('hex');

  return sha1Hash;
}
export function compareHashes(hash1: string, hash2: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(hash1, 'hex'),
    Buffer.from(hash2, 'hex')
  );
}