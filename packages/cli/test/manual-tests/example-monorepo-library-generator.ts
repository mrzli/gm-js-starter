import { resolvePathFromCwd } from '@mrzli/gm-js-libraries-node-utils/path';
import { makeDirectory } from '@mrzli/gm-js-libraries-node-utils/file-system';
import { generateMonorepoLibrary } from '../../src/project-generators/generate-monorepo-library';
import { GenerateMonorepoLibraryInput } from '../../src/types/project-generators/inputs/generate-monorepo-library-input';
import { ProjectType } from '../../src/types/base/project-type';
import { createGithubApi } from '@mrzli/gm-js-libraries-github-api';
import { getEnvOrThrow } from '@mrzli/gm-js-libraries-node-utils/env';
import { createNodePackagesApi } from '@mrzli/gm-js-libraries-node-packages-api';

async function test(): Promise<void> {
  const outputDir = resolvePathFromCwd('../../../gm-js-starter-output-dir');
  await makeDirectory(outputDir);

  const githubApi = createGithubApi(getEnvOrThrow('GITHUB_PASSWORD'));
  const nodePackagesApi = createNodePackagesApi();

  const input: GenerateMonorepoLibraryInput = {
    githubApi,
    nodePackagesApi,
    monorepoParentDirectory: outputDir,
    monorepoProjectName: 'example-monorepo',
    subprojectName: 'library',
    subprojectDescription: 'Some library project.',
    githubPackagesTokenEnvKey: 'GITHUB_PACKAGE_TOKEN',
    projectType: ProjectType.Library
  };
  await generateMonorepoLibrary(input);
}

test()
  .catch((error) => {
    console.error('Error', error);
  })
  .finally(() => {
    console.log('test ended');
  });
