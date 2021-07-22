import { Options } from 'prettier';

export const prettierConfig: Options = {
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
  requirePragma: false,
  insertPragma: false,
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  vueIndentScriptAndStyle: false,
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto'
};