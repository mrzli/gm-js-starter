import prettier from 'prettier';
import {
  JsonValueObject,
  JsonValueType,
} from '@mrzli/gm-js-libraries-json-serializer/types/json-value';
import { jsonSerialize } from '@mrzli/gm-js-libraries-json-serializer/serializer';
import {
  entryFieldObject,
  entryFieldString,
} from '@mrzli/gm-js-libraries-json-serializer/helpers';
import { NodePackagesApi } from '@mrzli/gm-js-libraries-node-packages-api';
import { JsonEntryField } from '@mrzli/gm-js-libraries-json-serializer/types/json-entry';
import { CreatePackageJsonInput } from '../../../types/file-generators/inputs/create-package-json-input';
import { getGeneratedFilePrettierParser } from '../../utils/generator-utils';
import { GeneratedFileType } from '../../../types/base/generated-file-type';
import { ReadonlyTuple2 } from '@mrzli/gm-js-libraries-utilities/types';
import { sortArrayByStringAsc } from '@mrzli/gm-js-libraries-utilities/array';

export async function createPackageJson(
  input: CreatePackageJsonInput
): Promise<string> {
  const data = await createPackageJsonData(input);
  const jsonString = jsonSerialize(data, { allowComments: false, spaces: 2 });
  return prettier.format(jsonString, {
    ...input.prettierConfig,
    parser: getGeneratedFilePrettierParser(GeneratedFileType.Json),
  });
}

async function createPackageJsonData(
  input: CreatePackageJsonInput
): Promise<JsonValueObject> {
  const {
    nodePackagesApi,
    githubUserName,
    githubUserEmail,
    githubRepositoryName,
    packageName,
    description,
    setupTests,
  } = input;

  const dependencies: readonly string[] = [];
  const devDependencies: readonly string[] = sortArrayByStringAsc([
    '@types/node',
    '@typescript-eslint/eslint-plugin',
    'eslint',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    'prettier',
    'ts-node',
    'typescript',
    ...(setupTests ? ['@types/jest', 'ts-jest'] : []),
  ]);

  const [dependenciesEntry, devDependenciesEntry] = await Promise.all([
    createEntryDependencies(nodePackagesApi, 'dependencies', dependencies),
    createEntryDependencies(
      nodePackagesApi,
      'devDependencies',
      devDependencies
    ),
  ]);

  return {
    type: JsonValueType.Object,
    value: [
      entryFieldString(
        'name',
        `@${githubUserName}/${githubRepositoryName}-${packageName}`
      ),
      entryFieldString('description', description),
      entryFieldString('version', '1.0.0'),
      entryFieldString('author', githubUserEmail),
      entryFieldObject('repository', [
        entryFieldString('type', 'git'),
        entryFieldString(
          'url',
          `https://github.com:${githubUserName}/${githubRepositoryName}.git`
        ),
        entryFieldString('directory', `packages/${packageName}`),
      ]),
      entryFieldString('license', 'MIT'),
      createEntryScripts(input),
      dependenciesEntry,
      devDependenciesEntry,
    ],
  };
}

function createEntryScripts(input: CreatePackageJsonInput): JsonEntryField {
  const { setupTests, setupScripts } = input;

  const scripts: readonly ReadonlyTuple2<string, string>[] = [
    ['build', 'rm -rf dist && tsc && cp ./package.json dist'],
    ['lint', 'eslint --ext .ts .'],
    ['prettier', 'prettier --check .'],
    ['prettier:write', 'prettier --write .'],
    ...getTestScripts(setupTests),
    ...getScriptScripts(setupScripts),
  ];

  return entryFieldObject(
    'scripts',
    scripts.map((script) => entryFieldString(script[0], script[1]))
  );
}

function getTestScripts(
  setupTests: boolean
): readonly ReadonlyTuple2<string, string>[] {
  if (!setupTests) {
    return [];
  }

  return [
    ['test', 'jest'],
    ['test:ci', 'jest --ci'],
  ];
}

function getScriptScripts(
  hasScripts: boolean
): readonly ReadonlyTuple2<string, string>[] {
  if (!hasScripts) {
    return [];
  }

  return [
    [
      'example-script',
      'ts-node --project tsconfig.scripts.json scripts/example-script.ts',
    ],
  ];
}

async function createEntryDependencies(
  nodePackagesApi: NodePackagesApi,
  dependenciesMainKey: string,
  dependencies: readonly string[]
): Promise<JsonEntryField> {
  const dependencyEntries = await Promise.all(
    dependencies.map((dep) => createDependency(nodePackagesApi, dep))
  );

  return entryFieldObject(dependenciesMainKey, dependencyEntries);
}

async function createDependency(
  nodePackagesApi: NodePackagesApi,
  packageName: string
): Promise<JsonEntryField> {
  return entryFieldString(
    packageName,
    await nodePackagesApi.getPackageLatestVersion(packageName)
  );
}
