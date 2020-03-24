import { getInput } from '@actions/core';
import { Context, Token } from './context';

export async function render(template: string): Promise<string> {
  let rendered = template.trim();

  (await Context.getInstance()).forEach((token: Token, key: string) => {
    const regex = new RegExp(`\\[${key}\\]`, 'g');
    rendered = rendered.replace(regex, token.toString());
  });

  // Remove unmatched
  rendered = rendered.replace(/\[.*?]/g, '');

  const escapeList = '\\^$*+?.()|{}[]-';
  const separators = getInput('separators') !== '' ? getInput('separators') : '.-+';
  const escaped = Array.from(separators)
    .map(sep => (escapeList.includes(sep) ? '\\' + sep : sep))
    .join('');

  // Remove unnecessary separators
  const duplicates = new RegExp(`[${escaped}]{2,}`, 'g');
  rendered.match(duplicates)?.forEach(m => {
    rendered = rendered.replace(m, m[0]);
  });

  const left = new RegExp(`^[${escaped}]+`, 'g');
  const right = new RegExp(`[${escaped}]+$`, 'g');
  rendered = rendered.replace(left, '').replace(right, '');

  return rendered;
}
