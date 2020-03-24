import { git } from '../../src/contexts/git';

jest.mock('../../src/lib/io', () => {
  return {
    execGetOutput: (): Promise<string> => Promise.resolve('1234567891011121314151617181920212223242'),
  };
});

describe('git context', () => {
  it.each([
    [
      'refs/heads/test/branch',
      {
        sha: '1234567891011121314151617181920212223242',
        shortSha: '1234567',
        ref: 'refs/heads/test/branch',
        isBranch: true,
        rawBranch: 'test/branch',
        branch: 'test-branch',
        isTag: false,
        rawTag: '',
        tag: '',
      },
    ],
    [
      'refs/tags/test/tag',
      {
        sha: '1234567891011121314151617181920212223242',
        shortSha: '1234567',
        ref: 'refs/tags/test/tag',
        isBranch: false,
        rawBranch: '',
        branch: '',
        isTag: true,
        rawTag: 'test/tag',
        tag: 'test-tag',
      },
    ],
    [
      '',
      {
        sha: '1234567891011121314151617181920212223242',
        shortSha: '1234567',
        ref: '',
        isBranch: false,
        rawBranch: '',
        branch: '',
        isTag: false,
        rawTag: '',
        tag: '',
      },
    ],
  ])('should returns a valid context', async (ref: string, expected) => {
    process.env.GITHUB_REF = ref;
    expect(await git()).toEqual(expected);
  });
});
