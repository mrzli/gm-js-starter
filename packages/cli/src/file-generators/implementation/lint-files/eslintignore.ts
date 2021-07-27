import { stringArrayItemsToFileString } from '../../utils/generator-utils';

export function createEslintIgnore(): string {
  const data = createEslintIgnoreData();
  return stringArrayItemsToFileString(data);
}

function createEslintIgnoreData(): readonly string[] {
  return ['/dist/'];
}
