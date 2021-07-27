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

export async function generateMonorepoLibrary(
  input: GenerateMonorepoLibraryInput
): Promise<void> {
  const {
    githubApi,
    nodePackagesApi,
    monorepoParentDirectory,
    monorepoProjectName,
    subprojectName,
    subprojectDescription,
    githubPackagesTokenEnvKey,
    hasTests,
    hasScripts,
  } = input;
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

  const rootFiles: readonly [string, string][] = [
    ['.gitignore', createGitIgnore()],
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
        hasTests,
        hasScripts,
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
    ['.prettierrc.js', createPrettierrcJs({ prettierConfig })],
    ['.eslintignore', createEslintIgnore()],
    ['.eslintrc.js', createEslintrcJs({ prettierConfig })],
    // ['jest.config.js', createJestConfigJsFile({ prettierConfigTsGenerator })],
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
    // [
    //   'tsconfig.scripts.json',
    //   createTsconfigScriptsJson({
    //     prettierConfig,
    //     projectType: ProjectType.Library,
    //   }),
    // ],
    // [
    //   'tsconfig.test.json',
    //   createTsconfigTestJson({
    //     prettierConfig,
    //     projectType: ProjectType.Library,
    //   }),
    // ],
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
    createExampleFile({ prettierConfig })
  );

  // const testDirectory = resolvePath(subprojectDirectory, 'test');
  // const automaticTestsDirectory = resolvePath(testDirectory, 'automatic-tests');
  // await makeDirectory(automaticTestsDirectory);
  // await writeStringToFile(
  //   resolvePath(automaticTestsDirectory, 'example.test.ts'),
  //   createExampleTestFile({ prettierConfigTsGenerator })
  // );
}
