import { exec } from '@actions/exec';
import { ExecOptions } from '@actions/exec/lib/interfaces';

export async function execGetOutput(commandLine: string, args?: string[], options?: ExecOptions): Promise<string> {
  let output = '';

  if (!options) {
    options = {
      listeners: {},
    };
  } else if (!options.listeners) {
    options.listeners = {};
  }

  options.silent = true;
  options.listeners = {
    ...options.listeners,
    ...{
      stdout: (stdout: Buffer): void => {
        output = stdout.toString().trim();
      },
    },
  };

  // We know for sure that the output will be set since we use await
  await exec(commandLine, args, options);

  return output;
}
