import { jsonSerialize } from '@mrzli/gm-js-libraries-json-serializer/serializer';
import {
  JsonValueObject,
  JsonValueType,
} from '@mrzli/gm-js-libraries-json-serializer/types/json-value';
import {
  entryArrayItemString,
  entryComment,
  entryFieldArray,
  entryFieldBoolean,
  entryFieldObject,
  entryFieldString,
} from '@mrzli/gm-js-libraries-json-serializer/helpers';
import { CreateTsconfigJsonInput } from '../../../types/file-generators/inputs/create-tsconfig-json-input';
import { ProjectType } from '../../../types/base/project-type';
import prettier from 'prettier';
import { getGeneratedFilePrettierParser } from '../../utils/generator-utils';
import { GeneratedFileType } from '../../../types/base/generated-file-type';

export function createTsconfigJson(input: CreateTsconfigJsonInput): string {
  const data = createTsconfigJsonData(input);
  const jsonString = jsonSerialize(data, { allowComments: false, spaces: 2 });
  return prettier.format(jsonString, {
    ...input.prettierConfig,
    parser: getGeneratedFilePrettierParser(GeneratedFileType.TsconfigJson),
  });
}

function createTsconfigJsonData(
  input: CreateTsconfigJsonInput
): JsonValueObject {
  const { projectType } = input;
  return {
    type: JsonValueType.Object,
    value: [
      entryFieldString('extends', './tsconfig.base.json'),
      entryFieldArray('include', [entryArrayItemString('src')]),
      entryFieldObject('compilerOptions', [
        entryComment('output'),
        entryFieldString('rootDir', './src'),
        entryFieldString('outDir', './dist'),
        entryFieldBoolean('declaration', getDeclaration(projectType)),
      ]),
    ],
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
