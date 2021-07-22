import {
  resolvePath,
  resolvePathFromCwd
} from '@mrzli/gm-js-libraries-file-system/path';
import { makeDirectory } from '@mrzli/gm-js-libraries-file-system/file-system';
import { generate } from '../../src/project-generators/generate';
import { GenerateProjectInput } from '../../src/types/project-generators/inputs/generate-project-input';
import { prettierConfig } from '../../src/file-generators/utils/prettier-config';

async function test(): Promise<void> {
  const testDataDir = resolvePathFromCwd('test/test-data');
  const outputDir = resolvePath(testDataDir, 'output-dir');
  await makeDirectory(outputDir);

  const input: GenerateProjectInput = {
    prettierConfig
  };
  await generate(input);
}

test().finally(() => {
  console.log('test ended');
});
