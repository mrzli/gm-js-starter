import {
  isDirectory,
  makeDirectory,
  writeStringToFile,
} from '@mrzli/gm-js-libraries-node-utils/file-system';
import {
  resolvePath,
  resolvePathFromCwd,
} from '@mrzli/gm-js-libraries-node-utils/path';
import { GenerateMonorepoLibraryInput } from '../types/project-generators/inputs/generate-monorepo-library-input';
import { PRETTIER_CONFIG } from '../file-generators/utils/prettier-config';
import { createGitIgnore } from '../file-generators/implementation/git-files/gitignore';
import { createPackageJson } from '../file-generators/implementation/npm-files/package-json';
import { createPrettierIgnore } from '../file-generators/implementation/lint-files/prettierignore';
import { createPrettierrcJs } from '../file-generators/implementation/lint-files/prettierrc-js';
import { createEslintIgnore } from '../file-generators/implementation/lint-files/eslintignore';
import { createEslintrcJs } from '../file-generators/implementation/lint-files/eslintrc-js';
import { createNpmrc } from '../file-generators/implementation/npm-files/npmrc';
import { createExampleFile } from '../file-generators/implementation/source-files/example-file-src';
import { createTsconfigJson } from '../file-generators/implementation/typescript-files/tsconfig-json';
import { ProjectType } from '../types/base/project-type';
import { createTsconfigBaseJson } from '../file-generators/implementation/typescript-files/tsconfig-base-json';
import { ReadonlyTuple2 } from '@mrzli/gm-js-libraries-utilities/types';
import { Options } from 'prettier';
import { GithubUserData } from '@mrzli/gm-js-libraries-github-api';
import { createJestConfigJsFile } from '../file-generators/implementation/test-files/jest-config-js';
import { createTsconfigTestJson } from '../file-generators/implementation/typescript-files/tsconfig-test-json';
import { createTsconfigScriptsJson } from '../file-generators/implementation/typescript-files/tsconfig-scripts-json';
import { createExampleTestFile } from '../file-generators/implementation/test-files/example-file-test';
import { createExampleScriptFile } from '../file-generators/implementation/script-files/example-file-script';
import { GeneratorContext } from '../types/project-generators/generator-context';

export async function generateMonorepoLibrary(
  input: GenerateMonorepoLibraryInput,
  context: GeneratorContext
): Promise<void> {
  const {
    monorepoParentDirectory,
    monorepoProjectName,
    subprojectName,
    setupTests,
    setupScripts,
  } = input;
  const { githubApi } = context;
  const prettierConfig = PRETTIER_CONFIG;

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

  const rootFiles = await getRootFiles(
    input,
    context,
    prettierConfig,
    githubUser
  );

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
    createExampleFile({ prettierConfig })
  );

  if (setupTests) {
    const testDirectory = resolvePath(subprojectDirectory, 'test');
    const automaticTestsDirectory = resolvePath(
      testDirectory,
      'automatic-tests'
    );
    await makeDirectory(automaticTestsDirectory);
    await writeStringToFile(
      resolvePath(automaticTestsDirectory, 'example.test.ts'),
      createExampleTestFile({ prettierConfig })
    );
  }

  if (setupScripts) {
    const scriptsDirectory = resolvePath(subprojectDirectory, 'scripts');
    await makeDirectory(scriptsDirectory);
    await writeStringToFile(
      resolvePath(scriptsDirectory, 'example-script.ts'),
      createExampleScriptFile({ prettierConfig })
    );
  }
}

async function getRootFiles(
  input: GenerateMonorepoLibraryInput,
  context: GeneratorContext,
  prettierConfig: Options,
  githubUser: GithubUserData
): Promise<readonly ReadonlyTuple2<string, string>[]> {
  const {
    monorepoProjectName,
    subprojectName,
    subprojectDescription,
    githubPackagesTokenEnvKey,
    setupTests,
    setupScripts,
  } = input;
  const { nodePackagesApi } = context;

  return [
    ['.gitignore', createGitIgnore({ setupTests })],
    [
      'package.json',
      await createPackageJson({
        nodePackagesApi,
        prettierConfig: PRETTIER_CONFIG,
        githubUserName: githubUser.login,
        githubUserEmail: githubUser.email,
        githubRepositoryName: monorepoProjectName,
        packageName: subprojectName,
        description: subprojectDescription,
        setupTests,
        setupScripts,
      }),
    ],
    [
      '.npmrc',
      createNpmrc({
        githubUserName: githubUser.login,
        githubPackagesTokenEnvKey,
      }),
    ],
    ['.prettierignore', createPrettierIgnore()],
    [
      '.prettierrc.js',
      createPrettierrcJs({
        prettierConfig,
      }),
    ],
    ['.eslintignore', createEslintIgnore()],
    [
      '.eslintrc.js',
      createEslintrcJs({
        prettierConfig,
        setupTests,
        setupScripts,
      }),
    ],
    [
      'tsconfig.base.json',
      createTsconfigBaseJson({
        prettierConfig,
        projectType: ProjectType.Library,
      }),
    ],
    [
      'tsconfig.json',
      createTsconfigJson({
        prettierConfig,
        projectType: ProjectType.Library,
      }),
    ],
    ...getTestRootFiles(setupTests, prettierConfig),
    ...getScriptsRootFiles(setupScripts, prettierConfig),
  ];
}

function getTestRootFiles(
  setupTests: boolean,
  prettierConfig: Options
): readonly ReadonlyTuple2<string, string>[] {
  if (!setupTests) {
    return [];
  }

  return [
    ['jest.config.js', createJestConfigJsFile({ prettierConfig })],
    [
      'tsconfig.test.json',
      createTsconfigTestJson({
        prettierConfig,
        projectType: ProjectType.Library,
      }),
    ],
  ];
}

function getScriptsRootFiles(
  hasScripts: boolean,
  prettierConfig: Options
): readonly ReadonlyTuple2<string, string>[] {
  if (!hasScripts) {
    return [];
  }

  return [
    [
      'tsconfig.scripts.json',
      createTsconfigScriptsJson({
        prettierConfig,
        projectType: ProjectType.Library,
      }),
    ],
  ];
}
