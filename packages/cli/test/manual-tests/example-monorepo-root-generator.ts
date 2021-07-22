import {
  resolvePath,
  resolvePathFromCwd
} from '@mrzli/gm-js-libraries-file-system/path';
import { makeDirectory } from '@mrzli/gm-js-libraries-file-system/file-system';
import { GenerateMonorepoRootInput } from '../../src/types/project-generators/inputs/generate-monorepo-root-input';
import { generateMonorepoRoot } from '../../src/project-generators/generate-monorepo-root';

async function test(): Promise<void> {
  const testDataDir = resolvePathFromCwd('test/test-data');
  const outputDir = resolvePath(testDataDir, 'output-dir');
  await makeDirectory(outputDir);

  const input: GenerateMonorepoRootInput = {
    parentDirectory: outputDir,
    projectName: 'example-monorepo',
    setupGit: false
  };
  await generateMonorepoRoot(input);
}

test().finally(() => {
  console.log('test ended');
});
