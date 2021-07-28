import { Options } from 'prettier';

export interface CreateEslintrcJsInput {
  readonly prettierConfig: Options;
  readonly setupTests: boolean;
  readonly setupScripts: boolean;
}
