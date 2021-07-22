import { stringArrayItemsToFileString } from '../../utils/generator-utils';

export function createPrettierIgnore(): string {
  const data = createPrettierIgnoreData();
  return stringArrayItemsToFileString(data);
}

function createPrettierIgnoreData(): readonly string[] {
  return [
    '/dist/',
    '',
    '/.eslintrc.js',
    '/README.md',
    '/tsconfig.json',
    '/tsconfig.eslint.json'
  ];
}
