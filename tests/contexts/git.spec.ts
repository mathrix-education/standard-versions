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
        branch: 'test/branch',
        branchSlug: 'test-branch',
        isTag: false,
        tag: '',
        tagSlug: '',
      },
    ],
    [
      'refs/tags/test/tag',
      {
        sha: '1234567891011121314151617181920212223242',
        shortSha: '1234567',
        ref: 'refs/tags/test/tag',
        isBranch: false,
        branch: '',
        branchSlug: '',
        isTag: true,
        tag: 'test/tag',
        tagSlug: 'test-tag',
      },
    ],
    [
      '',
      {
        sha: '1234567891011121314151617181920212223242',
        shortSha: '1234567',
        ref: '',
        isBranch: false,
        branch: '',
        branchSlug: '',
        isTag: false,
        tag: '',
        tagSlug: '',
      },
    ],
  ])('should returns a valid context', async (ref: string, expected) => {
    process.env.GITHUB_REF = ref;
    expect(await git()).toEqual(expected);
  });
});
