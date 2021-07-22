import {
  resolvePath,
  resolvePathFromCwd
} from '@mrzli/gm-js-libraries-file-system/path';
import {
  makeDirectory,
  writeStringToFile
} from '@mrzli/gm-js-libraries-file-system/file-system';
import { createExampleTestFile } from '../../src/file-generators/implementation/test-files/example-file-test';
import { prettierConfig } from '../../src/file-generators/utils/prettier-config';

async function test(): Promise<void> {
  const testDataDir = resolvePathFromCwd('test/test-data');
  const outputDir = resolvePath(testDataDir, 'output-dir');
  await makeDirectory(outputDir);

  const filePath = resolvePath(outputDir, 'example.test.ts');
  const tsString = createExampleTestFile({ prettierConfig });
  await writeStringToFile(filePath, tsString);
}

test().finally(() => {
  console.log('test ended');
});
