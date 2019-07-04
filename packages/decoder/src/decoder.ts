import LzString from 'lz-string';
import { read } from './reader';

export enum Compression {
  UTF16 = 'UTF16',
  Base64 = 'Base64',
  Off = 'Off'
}

export function decode(compression: Compression = Compression.Base64) {
  const config = read();
  switch (compression) {
    case Compression.Off:
      return config;
    case Compression.UTF16:
      return LzString.decompressFromUTF16(config);
    default:
      return LzString.decompressFromBase64(config);
  }
}
