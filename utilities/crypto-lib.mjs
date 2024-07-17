import crypto from 'crypto';
import pkg from 'elliptic';

const { ec } = pkg;

export const createHash = (stringToHash) => {
  return crypto.createHash('sha256').update(stringToHash).digest('hex');
};

export const ellipticHash = new ec('secp256k1');

export const verifySignature = ({ publicKey, data, signature }) => {
  const key = ellipticHash.keyFromPublic(publicKey, 'hex');
  return key.verify(createHash(data), signature);
};
