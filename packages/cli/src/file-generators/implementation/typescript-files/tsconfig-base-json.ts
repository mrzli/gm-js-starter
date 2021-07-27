import { jsonSerialize } from '@mrzli/gm-js-libraries-json-serializer/serializer';
import {
  JsonValueObject,
  JsonValueType,
} from '@mrzli/gm-js-libraries-json-serializer/types/json-value';
import {
  entryArrayItemString,
  entryComment,
  entryEmptyLine,
  entryFieldArray,
  entryFieldBoolean,
  entryFieldObject,
  entryFieldString,
} from '@mrzli/gm-js-libraries-json-serializer/helpers';
import { CreateTsconfigJsonInput } from '../../../types/file-generators/inputs/create-tsconfig-json-input';
import prettier from 'prettier';
import { getGeneratedFilePrettierParser } from '../../utils/generator-utils';
import { GeneratedFileType } from '../../../types/base/generated-file-type';

export function createTsconfigBaseJson(input: CreateTsconfigJsonInput): string {
  const data = createTsconfigJsonData();
  const jsonString = jsonSerialize(data, { allowComments: false, spaces: 2 });
  return prettier.format(jsonString, {
    ...input.prettierConfig,
    parser: getGeneratedFilePrettierParser(GeneratedFileType.TsconfigJson),
  });
}

function createTsconfigJsonData(): JsonValueObject {
  return {
    type: JsonValueType.Object,
    value: [
      entryFieldObject('compilerOptions', [
        entryComment('output'),
        entryEmptyLine(),
        entryComment('compilation'),
        entryFieldString('module', 'CommonJS'),
        entryFieldBoolean('removeComments', true),
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
          entryArrayItemString('DOM.Iterable'),
        ]),
        entryFieldArray('typeRoots', [
          entryArrayItemString('./node_modules/@types'),
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
        entryFieldBoolean('forceConsistentCasingInFileNames', true),
      ]),
    ],
  };
}
