import { RequiredOptions } from 'prettier';

export type PrettierConfig = Omit<
  RequiredOptions,
  'parser' | 'filepath' | 'plugins'
> & { readonly parser?: RequiredOptions['parser'] };
