import { stringArrayItemsToFileString } from '../../utils/generator-utils';
import { CreateGitignoreInput } from '../../../types/file-generators/inputs/create-gitignore-input';

export function createGitIgnore(input: CreateGitignoreInput): string {
  const data = createGitIgnoreData(input);
  return stringArrayItemsToFileString(data);
}

function createGitIgnoreData(input: CreateGitignoreInput): readonly string[] {
  const { hasTests } = input;
  return [
    '/.idea/',
    '/node_modules/',
    '/dist/',
    ...(hasTests ? ['', '/test/output/'] : []),
  ];
}
