import slug from 'slug';
import { UNKNOWN } from '../lib/constants';
import { TokenMap } from '../lib/context';
import { execGetOutput } from '../lib/io';

export async function git(): Promise<TokenMap> {
  const map = {
    sha: await execGetOutput('git', ['rev-parse', 'HEAD']),
    shortSha: UNKNOWN,
    ref: process.env.GITHUB_REF ?? '',
    isBranch: false,
    branch: '',
    branchSlug: '',
    isTag: false,
    tag: '',
    tagSlug: '',
  };

  map.shortSha = map.sha.substr(0, 7);

  if (map.ref === '') {
    return map;
  }

  const charmap = { ...slug.defaults.charmap, ...{ '/': '-', '#': '-' } };

  // Handle branch
  const branchMatches = map.ref.match(/^refs\/heads\/(.*)/);
  if (branchMatches !== null && branchMatches[1] !== undefined) {
    map.isBranch = true;
    map.branch = branchMatches[1];
    map.branchSlug = slug(branchMatches[1], { charmap }); // strip slashes
  }

  // Handle tags
  const tagsMatches = map.ref.match(/^refs\/tags\/(.*)/);
  if (tagsMatches !== null && tagsMatches[1] !== undefined) {
    map.isTag = true;
    map.tag = tagsMatches[1];
    map.tagSlug = slug(tagsMatches[1], { charmap }); // strip slashes
  }

  return map;
}
