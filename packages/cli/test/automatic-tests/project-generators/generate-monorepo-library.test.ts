import { resolvePath } from '@mrzli/gm-js-libraries-node-utils/path';
import { makeDirectory } from '@mrzli/gm-js-libraries-node-utils/file-system';
import {
  checkFileSystemStructureAndContentMatch,
  createGithubApiMock,
  createNodePackagesApiMock,
  getTestDirectoryManager,
  RawExpectData
} from './utils/project-generator-test-utils';
import { generateMonorepoLibrary } from '../../../src/project-generators/generate-monorepo-library';
import { GenerateMonorepoLibraryInput } from '../../../src/types/project-generators/inputs/generate-monorepo-library-input';
import { ProjectType } from '../../../src/types/base/project-type';

describe('generate-monorepo-library', () => {
  const TEST_DIRECTORY_MANAGER = getTestDirectoryManager();

  describe('generateMonorepoLibrary()', () => {
    interface Example {
      readonly description: string;
      readonly input: Omit<
        GenerateMonorepoLibraryInput,
        'monorepoParentDirectory'
      >;
      readonly expected: RawExpectData;
    }

    const EXAMPLES: readonly Example[] = [
      {
        description: 'library project',
        input: {
          githubApi: createGithubApiMock(),
          nodePackagesApi: createNodePackagesApiMock(),
          monorepoProjectName: 'example-monorepo',
          subprojectName: 'example-project',
          subprojectDescription: 'Project description.',
          githubPackagesTokenEnvKey: 'GITHUB_PACKAGES_TOKEN',
          projectType: ProjectType.Library
        },
        expected: {
          relativeProjectDir: 'example-monorepo/packages/example-project',
          files: [
            ['.eslintignore', 'library/stub.txt'],
            ['.eslintrc.js', 'library/stub.txt'],
            ['.gitignore', 'library/stub.txt'],
            ['.npmrc', 'library/stub.txt'],
            ['.prettierignore', 'library/stub.txt'],
            ['.prettierrc.js', 'library/stub.txt'],
            ['package.json', 'library/stub.txt'],
            ['tsconfig.json', 'library/stub.txt'],
            ['src/example.ts', 'library/stub.txt'],
            ['test/jest.config.js', 'library/stub.txt'],
            ['test/tsconfig.json', 'library/stub.txt'],
            ['test/automatic-tests/example.test.ts', 'library/stub.txt']
          ]
        }
      }
    ];

    EXAMPLES.forEach((example) => {
      it(
        example.description,
        TEST_DIRECTORY_MANAGER.usingTemporaryDirectory(async (testDir) => {
          // prepare stub monorepo dir
          await makeDirectory(
            resolvePath(testDir, example.input.monorepoProjectName)
          );

          const options: GenerateMonorepoLibraryInput = {
            ...example.input,
            monorepoParentDirectory: testDir
          };

          await generateMonorepoLibrary(options);

          await checkFileSystemStructureAndContentMatch(
            testDir,
            example.expected
          );
        })
      );
    });
  });
});
