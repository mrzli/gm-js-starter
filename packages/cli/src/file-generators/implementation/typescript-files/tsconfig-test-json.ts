import { jsonSerialize } from '@mrzli/gm-js-libraries-json-serializer/serializer';
import {
  JsonValueObject,
  JsonValueType,
} from '@mrzli/gm-js-libraries-json-serializer/types/json-value';
import {
  entryArrayItemString,
  entryFieldArray,
  entryFieldString,
} from '@mrzli/gm-js-libraries-json-serializer/helpers';
import { CreateTsconfigJsonInput } from '../../../types/file-generators/inputs/create-tsconfig-json-input';
import prettier from 'prettier';
import { getGeneratedFilePrettierParser } from '../../utils/generator-utils';
import { GeneratedFileType } from '../../../types/base/generated-file-type';

export function createTsconfigTestJson(input: CreateTsconfigJsonInput): string {
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
      entryFieldString('extends', './tsconfig.base.json'),
      entryFieldArray('include', [
        entryArrayItemString('src'),
        entryArrayItemString('test'),
      ]),
    ],
  };
}
