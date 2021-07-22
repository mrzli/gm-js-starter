import { CreateNpmrcInput } from '../../types/generators/inputs/create-npmrc-input';

export function createNpmrc(input: CreateNpmrcInput): readonly string[] {
  const { githubUserName, githubPackagesAuthTokenEnvVariableName } = input;

  return [
    `@${githubUserName}:registry=https://npm.pkg.github.com`,
    `//npm.pkg.github.com/:_authToken=$\{${githubPackagesAuthTokenEnvVariableName}}`
  ];
}
