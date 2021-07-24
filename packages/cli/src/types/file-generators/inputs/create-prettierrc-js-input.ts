import { PrettierConfig } from '../prettier-config';

export interface CreatePrettierrcJsInput {
  readonly prettierConfig: PrettierConfig;
  readonly prettierConfigTsGenerator: PrettierConfig;
}
