import { resolvePathFromCwd } from '@mrzli/gm-js-libraries-node-utils/path';
import { makeDirectory } from '@mrzli/gm-js-libraries-node-utils/file-system';
import { generateMonorepoRoot } from '../../src/project-generators/generate-monorepo-root';
import { GenerateMonorepoRootInput } from '../../src/types/project-generators/inputs/generate-monorepo-root-input';

async function test(): Promise<void> {
  const outputDir = resolvePathFromCwd('../../../gm-js-starter-output-dir');
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
