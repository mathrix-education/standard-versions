import { TokenMap } from '../lib/context';

export function github(): TokenMap {
  return {
    id: process.env.GITHUB_RUN_ID ?? '',
    number: process.env.GITHUB_RUN_NUMBER ?? '',
  };
}
