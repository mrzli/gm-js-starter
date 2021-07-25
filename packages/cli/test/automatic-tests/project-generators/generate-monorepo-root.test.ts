import { generateMonorepoRoot } from '../../../src/project-generators/generate-monorepo-root';
import { GenerateMonorepoRootInput } from '../../../src/types/project-generators/inputs/generate-monorepo-root-input';
import {
  checkFileSystemStructureAndContentMatch,
  getTestDirectoryManager,
  RawExpectData
} from './utils/project-generator-test-utils';

describe('generate-monorepo-root', () => {
  const TEST_DIRECTORY_MANAGER = getTestDirectoryManager();

  describe('generateMonorepoRoot()', () => {
    interface Example {
      readonly description: string;
      readonly input: Omit<
        GenerateMonorepoRootInput,
        'parentDirectory' | 'setupGit'
      >;
      readonly expected: RawExpectData;
    }

    const EXAMPLES: readonly Example[] = [
      {
        description: 'simple monorepo',
        input: {
          projectName: 'example-monorepo'
        },
        expected: {
          relativeProjectDir: 'example-monorepo',
          files: [['.gitignore', 'monorepo/gitignore.txt']]
        }
      }
    ];

    EXAMPLES.forEach((example) => {
      it(
        example.description,
        TEST_DIRECTORY_MANAGER.usingTemporaryDirectory(async (testDir) => {
          const options: GenerateMonorepoRootInput = {
            ...example.input,
            parentDirectory: testDir,
            setupGit: false
          };

          await generateMonorepoRoot(options);

          await checkFileSystemStructureAndContentMatch(
            testDir,
            example.expected
          );
        })
      );
    });
  });
});
