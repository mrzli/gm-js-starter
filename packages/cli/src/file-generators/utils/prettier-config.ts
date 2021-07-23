import { PrettierConfig } from '../../types/file-generators/prettier-config';

export const PRETTIER_CONFIG: PrettierConfig = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true, // default is false
  quoteProps: 'as-needed',
  jsxSingleQuote: true, // default is false
  trailingComma: 'none', // default is 'es5'
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'always',
  rangeStart: 0,
  rangeEnd: Infinity,
  parser: 'typescript',
  // filepath: undefined,
  // plugins: [],
  requirePragma: false,
  insertPragma: false,
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  vueIndentScriptAndStyle: false,
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto'
};
