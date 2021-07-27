import { resolvePath } from '@mrzli/gm-js-libraries-node-utils/path';
import { makeDirectory } from '@mrzli/gm-js-libraries-node-utils/file-system';
import {
  checkFileSystemStructureAndContentMatch,
  createGithubApiMock,
  createNodePackagesApiMock,
  getTestDirectoryManager,
  RawExpectData,
} from './utils/project-generator-test-utils';
import { generateMonorepoLibrary } from '../../../src/project-generators/generate-monorepo-library';
import { GenerateMonorepoLibraryInput } from '../../../src/types/project-generators/inputs/generate-monorepo-library-input';
import { ProjectType } from '../../../src/types/base/project-type';

describe('generate-monorepo-library', () => {
  const TEST_DIRECTORY_MANAGER = getTestDirectoryManager();

  describe('generateMonorepoLibrary()', () => {
    type ExampleInput = Omit<
      GenerateMonorepoLibraryInput,
      'monorepoParentDirectory'
    >;

    function createDefaultInput(): Omit<
      ExampleInput,
      'hasTests' | 'hasScripts'
    > {
      return {
        githubApi: createGithubApiMock(),
        nodePackagesApi: createNodePackagesApiMock(),
        monorepoProjectName: 'monorepo',
        subprojectName: 'library',
        subprojectDescription: 'Project description.',
        githubPackagesTokenEnvKey: 'GITHUB_PACKAGES_TOKEN',
        projectType: ProjectType.Library,
      };
    }

    interface Example {
      readonly description: string;
      readonly input: ExampleInput;
      readonly expected: RawExpectData;
    }

    const EXAMPLES: readonly Example[] = [
      {
        description: 'library project - no tests, no scripts',
        input: {
          ...createDefaultInput(),
          hasTests: false,
          hasScripts: false,
        },
        expected: {
          relativeProjectDir: 'monorepo/packages/library',
          files: [
            ['.eslintignore', 'library/eslintignore.txt'],
            ['.eslintrc.js', 'library/eslintrc-js_nothing.txt'],
            ['.gitignore', 'library/gitignore_nothing.txt'],
            ['.npmrc', 'library/npmrc.txt'],
            ['.prettierignore', 'library/prettierignore.txt'],
            ['.prettierrc.js', 'library/prettierrc-js.txt'],
            ['package.json', 'library/package-json_nothing.txt'],
            ['tsconfig.base.json', 'library/tsconfig-base-json.txt'],
            ['tsconfig.json', 'library/tsconfig-json.txt'],
            ['src/example.ts', 'library/example-ts.txt'],
          ],
        },
      },
      {
        description: 'library project - tests, no scripts',
        input: {
          ...createDefaultInput(),
          hasTests: true,
          hasScripts: false,
        },
        expected: {
          relativeProjectDir: 'monorepo/packages/library',
          files: [
            ['.eslintignore', 'library/eslintignore.txt'],
            ['.eslintrc.js', 'library/eslintrc-js_nothing.txt'],
            ['.gitignore', 'library/gitignore_nothing.txt'],
            ['.npmrc', 'library/npmrc.txt'],
            ['.prettierignore', 'library/prettierignore.txt'],
            ['.prettierrc.js', 'library/prettierrc-js.txt'],
            ['package.json', 'library/package-json_nothing.txt'],
            ['tsconfig.json', 'library/tsconfig-json.txt'],
            ['src/example.ts', 'library/example-ts.txt'],
            ['test/jest.config.js', 'library/stub.txt'],
            ['tsconfig.base.json', 'library/tsconfig-base-json.txt'],
            ['test/tsconfig.json', 'library/stub.txt'],
            ['test/automatic-tests/example.test.ts', 'library/stub.txt'],
          ],
        },
      },
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
            monorepoParentDirectory: testDir,
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
