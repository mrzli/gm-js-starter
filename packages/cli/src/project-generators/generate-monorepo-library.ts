import {
  isDirectory,
  makeDirectory,
  writeStringToFile
} from '@mrzli/gm-js-libraries-node-utils/file-system';
import {
  resolvePath,
  resolvePathFromCwd
} from '@mrzli/gm-js-libraries-node-utils/path';
import { getEnvOrThrow } from '@mrzli/gm-js-libraries-node-utils/env';
import { createGithubApi } from '@mrzli/gm-js-libraries-github-api';
import { GenerateMonorepoLibraryInput } from '../types/project-generators/inputs/generate-monorepo-library-input';
import {
  PRETTIER_CONFIG,
  PRETTIER_CONFIG_TS_GENERATOR
} from '../file-generators/utils/prettier-config';
import { createGitIgnore } from '../file-generators/implementation/git-files/gitignore';
import { createPackageJson } from '../file-generators/implementation/npm-files/package-json';
import { createNodePackagesApi } from '@mrzli/gm-js-libraries-node-packages-api';
import { createPrettierIgnore } from '../file-generators/implementation/lint-files/prettierignore';
import { createPrettierrcJs } from '../file-generators/implementation/lint-files/prettierrc-js';
import { createEslintIgnore } from '../file-generators/implementation/lint-files/eslintignore';
import { createEslintrcJs } from '../file-generators/implementation/lint-files/eslintrc-js';
import { createNpmrc } from '../file-generators/implementation/npm-files/npmrc';
import { createJestConfigJsFile } from '../file-generators/implementation/test-files/jest-config-js';
import { createExampleFile } from '../file-generators/implementation/source-files/example-file-src';
import { createExampleTestFile } from '../file-generators/implementation/test-files/example-file-test';
import { createTsconfigJson } from '../file-generators/implementation/typescript-files/tsconfig-json';
import { ProjectType } from '../types/base/project-type';
import { createTsconfigEslintJson } from '../file-generators/implementation/typescript-files/tsconfig-eslint-json';

export async function generateMonorepoLibrary(
  input: GenerateMonorepoLibraryInput
): Promise<void> {
  const {
    monorepoParentDirectory,
    monorepoProjectName,
    subprojectName,
    subprojectDescription,
    githubAccessTokenEnvKey,
    githubPackagesTokenEnvKey
  } = input;
  const prettierConfig = PRETTIER_CONFIG;
  const prettierConfigTsGenerator = PRETTIER_CONFIG_TS_GENERATOR;

  const githubApi = createGithubApi(getEnvOrThrow(githubAccessTokenEnvKey));
  const nodePackagesApi = createNodePackagesApi();

  const githubUser = await githubApi.getUser();

  const monorepoDirectory = resolvePathFromCwd(
    monorepoParentDirectory,
    monorepoProjectName
  );
  const monorepoDirectoryExists = await isDirectory(monorepoDirectory);
  if (!monorepoDirectoryExists) {
    console.error('Monorepo directory does not exits!');
    return;
  }

  const subprojectDirectory = resolvePath(
    monorepoDirectory,
    'packages',
    subprojectName
  );
  await makeDirectory(subprojectDirectory);

  const rootFiles: readonly [string, string][] = [
    ['.gitignore', createGitIgnore()],
    [
      'package.json',
      await createPackageJson({
        nodePackagesApi,
        githubUserName: githubUser.login,
        githubUserEmail: githubUser.email,
        githubRepositoryName: monorepoProjectName,
        packageName: subprojectName,
        description: subprojectDescription
      })
    ],
    [
      '.npmrc',
      createNpmrc({
        githubUserName: githubUser.login,
        githubPackagesTokenEnvKey
      })
    ],
    ['.prettierignore', createPrettierIgnore()],
    [
      '.prettierrc.js',
      createPrettierrcJs({ prettierConfig, prettierConfigTsGenerator })
    ],
    ['.eslintignore', createEslintIgnore()],
    ['.eslintrc.js', createEslintrcJs({ prettierConfigTsGenerator })],
    ['jest.config.js', createJestConfigJsFile({ prettierConfigTsGenerator })],
    ['tsconfig.json', createTsconfigJson({ projectType: ProjectType.Library })],
    ['tsconfig.eslint.json', createTsconfigEslintJson()]
  ];

  for (const rootFile of rootFiles) {
    await writeStringToFile(
      resolvePath(subprojectDirectory, rootFile[0]),
      rootFile[1]
    );
  }

  const srcDirectory = resolvePath(subprojectDirectory, 'src');
  await makeDirectory(srcDirectory);
  await writeStringToFile(
    resolvePath(srcDirectory, 'example.ts'),
    createExampleFile({ prettierConfigTsGenerator })
  );

  const automaticTestsDirectory = resolvePath(
    subprojectDirectory,
    'test',
    'automatic-tests'
  );
  await makeDirectory(automaticTestsDirectory);
  await writeStringToFile(
    resolvePath(automaticTestsDirectory, 'example.test.ts'),
    createExampleTestFile({ prettierConfigTsGenerator })
  );
}
