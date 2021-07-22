import {
  JsonValueObject,
  JsonValueType
} from '@mrzli/gm-js-libraries-json-serializer/types/json-value';
import { jsonSerialize } from '@mrzli/gm-js-libraries-json-serializer/serializer';
import {
  entryFieldObject,
  entryFieldString
} from '@mrzli/gm-js-libraries-json-serializer/helpers';
import { NodePackagesApi } from '@mrzli/gm-js-libraries-node-packages-api';
import { JsonEntryField } from '@mrzli/gm-js-libraries-json-serializer/types/json-entry';
import { CreatePackageJsonInput } from '../../../types/generators/inputs/create-package-json-input';

export async function createPackageJson(
  input: CreatePackageJsonInput
): Promise<string> {
  const data = await createPackageJsonData(input);
  return jsonSerialize(data, { allowComments: false, spaces: 2 });
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
    description
  } = input;

  const dependencies: readonly string[] = [];
  const devDependencies: readonly string[] = [
    '@types/jest',
    '@types/node',
    '@typescript-eslint/eslint-plugin',
    'eslint',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    'prettier',
    'ts-jest',
    'ts-node',
    'typescript'
  ];

  const [dependenciesEntry, devDependenciesEntry] = await Promise.all([
    createEntryDependencies(nodePackagesApi, 'dependencies', dependencies),
    createEntryDependencies(nodePackagesApi, 'devDependencies', devDependencies)
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
        entryFieldString('directory', `packages/${packageName}`)
      ]),
      entryFieldString('license', 'MIT'),
      createEntryScripts(),
      dependenciesEntry,
      devDependenciesEntry
    ]
  };
}

function createEntryScripts(): JsonEntryField {
  return entryFieldObject('scripts', [
    entryFieldString('build', 'rm -rf dist && tsc'),
    entryFieldString('lint', 'eslint --ext .ts .'),
    entryFieldString('prettier', 'prettier --check .'),
    entryFieldString('prettier:write', 'prettier --write .'),
    entryFieldString('test', 'jest'),
    entryFieldString('test:ci', 'jest --ci')
  ]);
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
