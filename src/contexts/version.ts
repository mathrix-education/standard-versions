import { existsSync, readFileSync } from 'fs';
import { UNKNOWN } from '../lib/constants';

interface JSONVersionFile {
  file: string;
  format: 'json';
  path: string;
}

type VersionFile = JSONVersionFile;

const WELL_KNOWN_FILES: VersionFile[] = [
  {
    file: 'composer.json',
    format: 'json',
    path: 'version',
  },
  {
    file: 'package.json',
    format: 'json',
    path: 'version',
  },
];

export function version(): string {
  const file = WELL_KNOWN_FILES.find((file: VersionFile) => {
    return existsSync(file.path);
  }) as VersionFile;

  if (!file) {
    return UNKNOWN;
  }

  if (file.format === 'json') {
    const data: { version: string } = JSON.parse(readFileSync(file.path, ''));
    return data.version ?? UNKNOWN;
  } else {
    return UNKNOWN;
  }
}
