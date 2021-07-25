import { resolvePath } from '@mrzli/gm-js-libraries-node-utils/path';
import {
  getDirectoryFilePaths,
  GetFilePathsUnderDirectoryRecursivelySortOrder,
  readFileAsString
} from '@mrzli/gm-js-libraries-node-utils/file-system';
import {
  createGithubApiMock,
  createNodePackagesApiMock,
  getTestDirectoryManager,
  prepareExpectData,
  RawExpectData
} from './utils/project-generator-test-utils';
import { generateMonorepoLibrary } from '../../../src/project-generators/generate-monorepo-library';
import { GenerateMonorepoLibraryInput } from '../../../src/types/project-generators/inputs/generate-monorepo-library-input';
import { ProjectType } from '../../../src/types/base/project-type';

describe('generate-monorepo-library', () => {
  const TEST_DIRECTORY_MANAGER = getTestDirectoryManager();

  describe('generateMonorepoLibrary()', () => {
    interface Example {
      readonly input: Omit<
        GenerateMonorepoLibraryInput,
        'monorepoParentDirectory'
      >;
      readonly expected: RawExpectData;
    }

    const EXAMPLES: readonly Example[] = [
      {
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
          files: [['.gitignore', 'root-gitignore.txt']]
        }
      }
    ];

    EXAMPLES.forEach((example) => {
      it(
        JSON.stringify(example.input),
        TEST_DIRECTORY_MANAGER.usingTemporaryDirectory(async (testDir) => {
          const options: GenerateMonorepoLibraryInput = {
            ...example.input,
            monorepoParentDirectory: testDir
          };

          const expected = await prepareExpectData(example.expected);

          await generateMonorepoLibrary(options);

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
