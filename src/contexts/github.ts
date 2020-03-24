import { UNKNOWN } from '../lib/constants';
import { TokenMap } from '../lib/context';

export function github(): TokenMap {
  return {
    id: process.env.GITHUB_RUN_ID ?? UNKNOWN,
    number: process.env.GITHUB_RUN_NUMBER ?? '0000',
  };
}
