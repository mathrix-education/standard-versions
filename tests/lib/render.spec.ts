import { Context, Token, TokenCallback } from '../../src/lib/context';
import { render } from '../../src/lib/render';

jest.mock('../../src/lib/context');

const context = {
  version: 'x.y.z',
  ref: 'refs/heads/test-ref',
  branch: 'test-branch',
  branchSlug: 'test-branch',
  tag: 'test-tag',
  tagSlug: 'test-tag',
  sha: '1234567890abcdefghijklmnopqrstuvwxzABCDE',
  shortSha: '1234567',
  id: 'test-run-id',
  number: '1234',
} as any;

describe('Template renderer', () => {
  beforeEach(() => {
    // Setup context mock
    Context.getInstance = jest.fn().mockResolvedValue({
      forEach: (callback: TokenCallback) => {
        Object.entries(context).forEach(([key, value]) => {
          callback(value as Token, key);
        });
      },
      get: (k: string) => context[k] ?? 'foo',
    });
  });

  it.each([
    // default versions
    ['[version]', 'x.y.z'],
    ['[version]+[number].[branch].[shortSha]', 'x.y.z+1234.test-branch.1234567'],
    ['[version]-[number].[branchSlug].[shortSha]', 'x.y.z-1234.test-branch.1234567'],
    // non-existing tokens
    ['[version][idontexist]', 'x.y.z'],
    ['[version]+[idontexist].[branch].[shortSha]', 'x.y.z+test-branch.1234567'],
    ['[version]-[idontexist].[branch].[shortSha]', 'x.y.z-test-branch.1234567'],
    // separators trimming
    ['a..b', 'a.b'],
    ['a..b..c', 'a.b.c'],
    ['a.+b', 'a.b'],
    ['.a.b', 'a.b'],
    ['a.b.', 'a.b'],
    ['.+a.-b+-', 'a.b'],
  ])('should render correctly', async (template: string, expected: string) => {
    expect(await render(template)).toBe(expected);
  });
});
