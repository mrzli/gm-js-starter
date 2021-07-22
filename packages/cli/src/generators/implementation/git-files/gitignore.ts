import { stringArrayItemsToFileString } from '../../utils/generator-utils';

export function createGitIgnore(): string {
  const data = createGitIgnoreData();
  return stringArrayItemsToFileString(data);
}

function createGitIgnoreData(): readonly string[] {
  return ['/.idea/', '/node_modules/', '/dist/'];
}
