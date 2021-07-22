import { stringArrayItemsToFileString } from '../../utils/generator-utils';

export function createMonorepoRootGitIgnore(): string {
  const data = createMonorepoRootGitIgnoreData();
  return stringArrayItemsToFileString(data);
}

function createMonorepoRootGitIgnoreData(): readonly string[] {
  return ['/.idea/'];
}
