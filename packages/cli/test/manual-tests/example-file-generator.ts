import {
  resolvePath,
  resolvePathFromCwd
} from '@mrzli/gm-js-libraries-file-system/path';
import {
  copyDirectorySubset,
  makeDirectory,
  writeStringToFile
} from '@mrzli/gm-js-libraries-file-system/file-system';
import { createSourceFile } from '../../src/generators/implementation/source-files/example-file';

async function test(): Promise<void> {
  const testDataDir = resolvePathFromCwd('test/test-data');
  const outputDir = resolvePath(testDataDir, 'output-dir');
  await makeDirectory(outputDir);

  const filePath = resolvePath(outputDir, 'example.ts');
  const tsString = createSourceFile();
  await writeStringToFile(filePath, tsString);
}

test().finally(() => {
  console.log('test ended');
});
