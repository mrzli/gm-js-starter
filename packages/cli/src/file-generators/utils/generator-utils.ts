import ts from 'typescript';
import prettier, { BuiltInParserName, Options } from 'prettier';
import { GeneratedFileType } from '../../types/base/generated-file-type';

const EMPTY_LINE_PLACEHOLDER = '<<<<<EMPTY_LINE>>>>>';

export function stringArrayItemsToFileString(
  arrayItems: readonly string[]
): string {
  return arrayItems.join('\n').concat('\n');
}

export function tsStatementsToFileString(
  statements: readonly ts.Statement[],
  prettierConfig: Options
): string {
  const f = ts.factory;
  const sourceFile = f.createSourceFile(
    statements,
    f.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const nonFormattedString = printer.printFile(sourceFile);
  const nonFormattedStringWithEmptyLines = nonFormattedString.replaceAll(
    `"${EMPTY_LINE_PLACEHOLDER}"`,
    '\n'
  );
  return prettier.format(nonFormattedStringWithEmptyLines, prettierConfig);
}

export function tsCreateEmptyLinePlaceholder(): ts.Statement {
  const f = ts.factory;
  return f.createExpressionStatement(
    f.createStringLiteral(EMPTY_LINE_PLACEHOLDER)
  );
}

export function getGeneratedFilePrettierParser(
  generatedFileType: GeneratedFileType
): BuiltInParserName {
  switch (generatedFileType) {
    case GeneratedFileType.TypeScript:
      return 'typescript';
    case GeneratedFileType.JavaScript:
      return 'babel';
    case GeneratedFileType.Json:
      return 'json';
    case GeneratedFileType.TsconfigJson:
      return 'json';
    case GeneratedFileType.Markdown:
      return 'markdown';
    case GeneratedFileType.Html:
      return 'html';
  }
}
