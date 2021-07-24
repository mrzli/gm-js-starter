import ts from 'typescript';
import { tsStatementsToFileString } from '../../utils/generator-utils';
import { CreatePrettierrcJsInput } from '../../../types/file-generators/inputs/create-prettierrc-js-input';

export function createPrettierrcJs(input: CreatePrettierrcJsInput): string {
  const statements = createPrettierrcJsSyntaxTree(input);
  return tsStatementsToFileString(statements, input.prettierConfigTsGenerator);
}

function createPrettierrcJsSyntaxTree(
  input: CreatePrettierrcJsInput
): readonly ts.Statement[] {
  const { prettierConfig } = input;
  const f = ts.factory;
  return [
    f.createExpressionStatement(
      f.createBinaryExpression(
        f.createPropertyAccessExpression(
          f.createIdentifier('module'),
          f.createIdentifier('exports')
        ),
        f.createToken(ts.SyntaxKind.EqualsToken),
        f.createObjectLiteralExpression(
          [
            f.createPropertyAssignment(
              f.createIdentifier('printWidth'),
              f.createNumericLiteral(prettierConfig.printWidth)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('tabWidth'),
              f.createNumericLiteral(prettierConfig.tabWidth)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('useTabs'),
              createBoolean(prettierConfig.useTabs)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('semi'),
              createBoolean(prettierConfig.semi)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('singleQuote'),
              createBoolean(prettierConfig.singleQuote)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('quoteProps'),
              f.createStringLiteral(prettierConfig.quoteProps)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('jsxSingleQuote'),
              createBoolean(prettierConfig.jsxSingleQuote)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('trailingComma'),
              f.createStringLiteral(prettierConfig.trailingComma)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('bracketSpacing'),
              createBoolean(prettierConfig.bracketSpacing)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('jsxBracketSameLine'),
              createBoolean(prettierConfig.jsxBracketSameLine)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('arrowParens'),
              f.createStringLiteral(prettierConfig.arrowParens)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('rangeStart'),
              f.createNumericLiteral(prettierConfig.rangeStart)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('rangeEnd'),
              prettierConfig.rangeEnd === Infinity
                ? f.createIdentifier('Infinity')
                : f.createNumericLiteral(prettierConfig.rangeEnd)
            ),
            // parser should not be set of the end project (for now)
            // f.createPropertyAssignment(
            //   f.createIdentifier('parser'),
            //   f.createStringLiteral(prettierConfig.parser)
            // ),
            f.createPropertyAssignment(
              f.createIdentifier('requirePragma'),
              createBoolean(prettierConfig.requirePragma)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('insertPragma'),
              createBoolean(prettierConfig.insertPragma)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('proseWrap'),
              f.createStringLiteral(prettierConfig.proseWrap)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('htmlWhitespaceSensitivity'),
              f.createStringLiteral(prettierConfig.htmlWhitespaceSensitivity)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('vueIndentScriptAndStyle'),
              createBoolean(prettierConfig.vueIndentScriptAndStyle)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('endOfLine'),
              f.createStringLiteral(prettierConfig.endOfLine)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('embeddedLanguageFormatting'),
              f.createStringLiteral(prettierConfig.embeddedLanguageFormatting)
            )
          ],
          true
        )
      )
    )
  ];
}

function createBoolean(value: boolean): ts.TrueLiteral | ts.FalseLiteral {
  const f = ts.factory;
  return value ? f.createTrue() : f.createFalse();
}
