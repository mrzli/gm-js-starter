import { ReadonlyTuple2 } from '@mrzli/gm-js-libraries-utilities/types';
import {
  getDirectoryFilePaths,
  GetFilePathsUnderDirectoryRecursivelySortOrder,
  readFileAsString,
} from '@mrzli/gm-js-libraries-node-utils/file-system';
import {
  joinPath,
  resolvePath,
  resolvePathFromCwd,
} from '@mrzli/gm-js-libraries-node-utils/path';
import {
  createTestDirectoryManager,
  TestDirectoryManager,
} from '@mrzli/gm-js-libraries-test-utils/file-system';
import {
  CreateRepositoryParams,
  DeleteRepositoryParams,
  GithubApi,
  GithubRepositoryData,
  GithubUserData,
} from '@mrzli/gm-js-libraries-github-api';
import { NodePackagesApi } from '@mrzli/gm-js-libraries-node-packages-api';
import { getSpecificDateIsoStringPreciseUtc } from '@mrzli/gm-js-libraries-test-utils/date';
import { isoStringPreciseUtcToIsoStringNonPreciseUtc } from '@mrzli/gm-js-libraries-utilities/date';

export async function checkFileSystemStructureAndContentMatch(
  testDir: string,
  rawExpected: RawExpectData
): Promise<void> {
  const expected = await prepareExpectData(rawExpected);

  const directoryFilePaths = await getDirectoryFilePaths(testDir, {
    sortOrder: GetFilePathsUnderDirectoryRecursivelySortOrder.FilesFirst,
  });

  expect(directoryFilePaths).toEqual(expected.entries);
  for (const filePath of directoryFilePaths) {
    const fullPath = resolvePath(testDir, filePath);
    const actualContent = await readFileAsString(fullPath);
    expect(actualContent).toEqual(expected.contentMap.get(filePath));
  }
}

export interface RawExpectData {
  readonly relativeProjectDir: string;
  readonly files: readonly ReadonlyTuple2<string, string>[];
}

export interface PreparedExpectData {
  readonly entries: readonly string[];
  readonly contentMap: Map<string, string>;
}

export async function prepareExpectData(
  expected: RawExpectData
): Promise<PreparedExpectData> {
  const entries: readonly string[] = expected.files.map((entry) =>
    joinPath(expected.relativeProjectDir, entry[0])
  );
  const dataList: readonly string[] = await Promise.all(
    expected.files.map((entry) =>
      readFileAsString(
        resolvePath(__dirname, '..', 'compare-to-files', entry[1])
      )
    )
  );
  const contentMap = new Map<string, string>();
  for (let i = 0; i < entries.length; i++) {
    contentMap.set(entries[i] as string, dataList[i] as string);
  }

  return {
    entries,
    contentMap,
  };
}

export function getTestDirectoryManager(): TestDirectoryManager {
  return createTestDirectoryManager(
    resolvePathFromCwd('test/test-data/output-dir')
  );
}

export function createGithubApiMock(): GithubApi {
  return {
    getUser: async (): Promise<GithubUserData> => {
      return {
        id: 'github-id',
        login: 'github-login',
        email: 'github-email@example.com',
      };
    },
    createRepository: async (
      _input: CreateRepositoryParams
    ): Promise<GithubRepositoryData | undefined> => {
      return {
        name: 'repository-name',
        createdAt: isoStringPreciseUtcToIsoStringNonPreciseUtc(
          getSpecificDateIsoStringPreciseUtc()
        ),
      };
    },
    deleteRepository: async (
      _input: DeleteRepositoryParams
    ): Promise<void> => {},
  };
}

export function createNodePackagesApiMock(): NodePackagesApi {
  return {
    getPackageLatestVersion: async (packageName: string): Promise<string> => {
      return `1.0.0-${packageName}`;
    },
  };
}
