import { readFileSync, existsSync } from 'fs';
import { isHexString } from 'ethers';

export const loadPrivateKey = () => {
  if (!existsSync('pk.txt')) throw new Error('File pk.txt tidak ditemukan');
  const pk = readFileSync('pk.txt', 'utf-8').trim();
  if (!isHexString(pk, 32)) throw new Error('Format private key salah (harus 64 karakter hex)');
  return pk;
};

export const loadRPC = () => {
  if (!existsSync('rpc.txt')) throw new Error('File rpc.txt tidak ditemukan');
  const rpc = readFileSync('rpc.txt', 'utf-8').trim();
  if (!rpc.startsWith('http')) throw new Error('Format RPC tidak valid');
  return rpc;
};

export const loadConstructorArgs = () => {
  return [100]; // Default initial value untuk constructor
};