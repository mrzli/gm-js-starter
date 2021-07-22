import { jsonSerialize } from '@mrzli/gm-js-libraries-json-serializer/serializer';
import {
  JsonValueObject,
  JsonValueType
} from '@mrzli/gm-js-libraries-json-serializer/types/json-value';
import {
  entryArrayItemString,
  entryFieldArray,
  entryFieldString
} from '@mrzli/gm-js-libraries-json-serializer/helpers';

export function createTsconfigEslintJson(): string {
  const data = createTsconfigEslintJsonData();
  return jsonSerialize(data, { allowComments: false, spaces: 2 });
}

function createTsconfigEslintJsonData(): JsonValueObject {
  return {
    type: JsonValueType.Object,
    value: [
      entryFieldString('extends', './tsconfig.json'),
      entryFieldArray('include', [
        entryArrayItemString('src'),
        entryArrayItemString('test'),
        entryArrayItemString('scripts')
      ])
    ]
  };
}
