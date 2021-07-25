import { generateMonorepoRoot } from '../../../src/project-generators/generate-monorepo-root';
import { GenerateMonorepoRootInput } from '../../../src/types/project-generators/inputs/generate-monorepo-root-input';
import { createTestDirectoryManager } from '@mrzli/gm-js-libraries-node-utils/test-utils';
import {
  resolvePath,
  resolvePathFromCwd
} from '@mrzli/gm-js-libraries-node-utils/path';
import {
  getDirectoryFilePaths,
  GetFilePathsUnderDirectoryRecursivelySortOrder,
  readFileAsString
} from '@mrzli/gm-js-libraries-node-utils/file-system';
import {
  prepareExpectData,
  RawExpectData
} from './utils/project-generator-test-utils';

describe('generate-monorepo-root', () => {
  const TEST_DIRECTORY_MANAGER = createTestDirectoryManager(
    resolvePathFromCwd('test/test-data/output-dir')
  );

  describe('generateMonorepoRoot()', () => {
    interface Example {
      readonly input: Omit<
        GenerateMonorepoRootInput,
        'parentDirectory' | 'setupGit'
      >;
      readonly expected: RawExpectData;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          projectName: 'example-monorepo'
        },
        expected: {
          relativeProjectDir: 'example-monorepo',
          files: [['.gitignore', 'root-gitignore.txt']]
        }
      }
    ];

    EXAMPLES.forEach((example) => {
      it(
        JSON.stringify(example.input),
        TEST_DIRECTORY_MANAGER.usingTemporaryDirectory(async (testDir) => {
          const options: GenerateMonorepoRootInput = {
            ...example.input,
            parentDirectory: testDir,
            setupGit: false
          };

          const expected = await prepareExpectData(example.expected);

          await generateMonorepoRoot(options);

          const directoryFilePaths = await getDirectoryFilePaths(testDir, {
            sortOrder:
              GetFilePathsUnderDirectoryRecursivelySortOrder.DirectoriesFirst
          });

          expect(directoryFilePaths).toEqual(expected.entries);
          for (const filePath of directoryFilePaths) {
            const fullPath = resolvePath(testDir, filePath);
            const actualContent = await readFileAsString(fullPath);
            expect(actualContent).toEqual(expected.contentMap.get(filePath));
          }
        })
      );
    });
  });
});
