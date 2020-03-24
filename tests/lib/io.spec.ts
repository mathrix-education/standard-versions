import { execGetOutput } from '../../src/lib/io';

describe('execGetOutput', () => {
  it.each([
    ['test', 'test'],
    [' left', 'left'],
    ['right ', 'right'],
    [' both ', 'both'],
  ])('should get the correct output', async (subject: string, expected: string) => {
    expect(expected).toBe(await execGetOutput(`echo -n "${subject}"`));
  });
});
