import { getInput, setFailed, setOutput, warning } from '@actions/core';
import { Context } from './lib/context';
import { render } from './lib/render';

async function main(): Promise<void> {
  // Generate version
  const versions = getInput('templates')
    .split(',')
    .map(v => v.trim());

  for (const v of versions) {
    const template = getInput(v);

    if (!template) {
      warning('Template ' + v + ' does not exists');
      continue;
    }

    setOutput(v, await render(v));
  }

  // Output context
  const context = await Context.getInstance();

  Object.keys(context).forEach(k => {
    setOutput(k, context.get(k).toString());
  });
}

main().catch(e => setFailed(e));
