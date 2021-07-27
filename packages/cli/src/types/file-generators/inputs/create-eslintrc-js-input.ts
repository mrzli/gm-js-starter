import { Options } from 'prettier';

export interface CreateEslintrcJsInput {
  readonly prettierConfig: Options;
  readonly hasTests: boolean;
  readonly hasScripts: boolean;
}
