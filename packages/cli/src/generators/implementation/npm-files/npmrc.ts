import { CreateNpmrcInput } from '../../../types/generators/inputs/create-npmrc-input';
import { stringArrayItemsToFileString } from '../../utils/generator-utils';

export function createNpmrc(input: CreateNpmrcInput): string {
  const data = createNpmrcData(input);
  return stringArrayItemsToFileString(data);
}

function createNpmrcData(input: CreateNpmrcInput): readonly string[] {
  const { githubUserName, githubPackagesAuthTokenEnvVariableName } = input;

  return [
    `@${githubUserName}:registry=https://npm.pkg.github.com`,
    `//npm.pkg.github.com/:_authToken=$\{${githubPackagesAuthTokenEnvVariableName}}`
  ];
}