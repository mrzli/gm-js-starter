import {
  resolvePath,
  resolvePathFromCwd
} from '@mrzli/gm-js-libraries-node-utils/path';
import { makeDirectory } from '@mrzli/gm-js-libraries-node-utils/file-system';
import { generateMonorepoLibrary } from '../../src/project-generators/generate-monorepo-library';
import { GenerateMonorepoLibraryInput } from '../../src/types/project-generators/inputs/generate-monorepo-library-input';

async function test(): Promise<void> {
  const testDataDir = resolvePathFromCwd('test/test-data');
  const outputDir = resolvePath(testDataDir, 'output-dir');
  await makeDirectory(outputDir);

  const input: GenerateMonorepoLibraryInput = {
    monorepoParentDirectory: outputDir,
    monorepoProjectName: 'example-monorepo',
    subprojectName: 'library',
    subprojectDescription: 'Some library project.',
    githubAccessTokenEnvKey: 'GITHUB_PASSWORD',
    githubPackagesTokenEnvKey: 'GITHUB_PACKAGE_TOKEN'
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
