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
    '/.jest.config.js',
    '/tsconfig.json',
    '/tsconfig.eslint.json',
    '/README.md'
  ];
}
