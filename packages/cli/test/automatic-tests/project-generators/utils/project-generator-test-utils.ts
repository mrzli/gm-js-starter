import { ReadonlyTuple2 } from '@mrzli/gm-js-libraries-utilities/types';
import { readFileAsString } from '@mrzli/gm-js-libraries-node-utils/file-system';
import { joinPath, resolvePath } from '@mrzli/gm-js-libraries-node-utils/path';

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
    contentMap
  };
}
