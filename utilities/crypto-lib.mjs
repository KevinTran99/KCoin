import crypto from 'crypto';
import { ec } from 'elliptic';

export const createHash = (stringToHash) => {
  return crypto.createHash('sha256').update(stringToHash).digest('hex');
};

export const ellipticHash = new ec('secp256k1');
