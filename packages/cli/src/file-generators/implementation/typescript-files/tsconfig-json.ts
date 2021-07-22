import { jsonSerialize } from '@mrzli/gm-js-libraries-json-serializer/serializer';
import {
  JsonValueObject,
  JsonValueType
} from '@mrzli/gm-js-libraries-json-serializer/types/json-value';
import {
  entryArrayItemString,
  entryComment,
  entryEmptyLine,
  entryFieldArray,
  entryFieldBoolean,
  entryFieldObject,
  entryFieldString
} from '@mrzli/gm-js-libraries-json-serializer/helpers';
import { CreateTsconfigJsonInput } from '../../../types/file-generators/inputs/create-tsconfig-json-input';
import { ProjectType } from '../../../types/file-generators/inputs/project-type';

export function createTsconfigJson(input: CreateTsconfigJsonInput): string {
  const data = createTsconfigJsonData(input);
  return jsonSerialize(data, { allowComments: true, spaces: 2 });
}

function createTsconfigJsonData(
  input: CreateTsconfigJsonInput
): JsonValueObject {
  const { projectType } = input;
  return {
    type: JsonValueType.Object,
    value: [
      entryFieldArray('include', [entryArrayItemString('src')]),
      entryFieldObject('compilerOptions', [
        entryComment('output'),
        entryFieldString('rootDir', './src'),
        entryFieldString('outDir', './dist'),
        entryFieldBoolean('declaration', getDeclaration(projectType)),
        entryEmptyLine(),
        entryComment('compilation'),
        entryFieldString('module', 'CommonJS'),
        entryFieldBoolean('RemoveComments', true),
        entryFieldString('target', 'ES6'),
        entryEmptyLine(),
        entryComment('checks'),
        entryFieldBoolean('strict', true),
        entryEmptyLine(),
        entryComment('module resolution'),
        entryFieldString('moduleResolution', 'node'),
        entryFieldBoolean('allowSyntheticDefaultImports', true),
        entryFieldBoolean('esModuleInterop', true),
        entryEmptyLine(),
        entryComment('typing'),
        entryFieldArray('lib', [
          entryArrayItemString('ESNext'),
          entryArrayItemString('DOM'),
          entryArrayItemString('DOM.Iterable')
        ]),
        entryFieldArray('typeRoots', [
          entryArrayItemString('./node_modules/@types')
        ]),
        entryEmptyLine(),
        entryComment('linting'),
        entryFieldBoolean('noFallthroughCasesInSwitch', true),
        entryFieldBoolean('noImplicitOverride', true),
        entryFieldBoolean('noImplicitReturns', true),
        entryFieldBoolean('noPropertyAccessFromIndexSignature', true),
        entryFieldBoolean('noUncheckedIndexedAccess', true),
        entryEmptyLine(),
        entryComment('advanced'),
        entryFieldBoolean('skipLibCheck', true),
        entryFieldBoolean('forceConsistentCasingInFileNames', true)
      ])
    ]
  };
}

function getDeclaration(projectType: ProjectType): boolean {
  switch (projectType) {
    case ProjectType.Cli:
      return false;
    default:
      return true;
  }
}
