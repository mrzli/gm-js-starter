import { ReadonlyOmit } from '@mrzli/gm-js-libraries-utilities/types';
import { RequiredOptions } from 'prettier';

export type PrettierConfig = ReadonlyOmit<
  RequiredOptions,
  'parser' | 'filepath' | 'plugins'
> & { readonly parser: string };
