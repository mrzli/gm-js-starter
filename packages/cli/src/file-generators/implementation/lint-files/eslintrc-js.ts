import ts from 'typescript';
import {
  getGeneratedFilePrettierParser,
  tsStatementsToFileString,
} from '../../utils/generator-utils';
import { CreateEslintrcJsInput } from '../../../types/file-generators/inputs/create-eslintrc-js-input';
import { GeneratedFileType } from '../../../types/base/generated-file-type';

export function createEslintrcJs(input: CreateEslintrcJsInput): string {
  const statements = createEslintrcJsSyntaxTree(input);
  return tsStatementsToFileString(statements, {
    ...input.prettierConfig,
    parser: getGeneratedFilePrettierParser(GeneratedFileType.JavaScript),
  });
}

function createEslintrcJsSyntaxTree(
  input: CreateEslintrcJsInput
): readonly ts.Statement[] {
  const { hasTests, hasScripts } = input;
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
              f.createIdentifier('parser'),
              f.createStringLiteral('@typescript-eslint/parser')
            ),
            f.createPropertyAssignment(
              f.createIdentifier('parserOptions'),
              f.createObjectLiteralExpression(
                [
                  f.createPropertyAssignment(
                    f.createIdentifier('project'),
                    createNodeParserOptionsProject(f, hasTests, hasScripts)
                  ),
                ],
                true
              )
            ),
            f.createPropertyAssignment(
              f.createIdentifier('plugins'),
              createNodePlugins(f)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('extends'),
              createNodeExtends(f)
            ),
            f.createPropertyAssignment(
              f.createIdentifier('rules'),
              createNodeRules(f)
            ),
          ],
          true
        )
      )
    ),
  ];
}

function createNodeParserOptionsProject(
  f: ts.NodeFactory,
  hasTests: boolean,
  hasScripts: boolean
): ts.ArrayLiteralExpression {
  const projects: readonly string[] = [
    'tsconfig.json',
    ...(hasTests ? ['tsconfig.test.json'] : []),
    ...(hasScripts ? ['tsconfig.scripts.json'] : []),
  ];

  return f.createArrayLiteralExpression(
    projects.map((project) => f.createStringLiteral(project)),
    false
  );
}

function createNodePlugins(f: ts.NodeFactory): ts.ArrayLiteralExpression {
  return f.createArrayLiteralExpression(
    [f.createStringLiteral('prettier')],
    false
  );
}

function createNodeExtends(f: ts.NodeFactory): ts.ArrayLiteralExpression {
  return f.createArrayLiteralExpression(
    [
      f.createStringLiteral('eslint:recommended'),
      f.createStringLiteral('plugin:@typescript-eslint/recommended'),
      f.createStringLiteral('plugin:prettier/recommended'),
    ],
    true
  );
}

function createNodeRules(f: ts.NodeFactory): ts.ObjectLiteralExpression {
  return f.createObjectLiteralExpression(
    [
      f.createPropertyAssignment(
        f.createStringLiteral(
          '@typescript-eslint/explicit-function-return-type'
        ),
        f.createArrayLiteralExpression(
          [
            f.createStringLiteral('error'),
            f.createObjectLiteralExpression(
              [
                f.createPropertyAssignment(
                  f.createIdentifier('allowExpressions'),
                  f.createTrue()
                ),
              ],
              true
            ),
          ],
          true
        )
      ),
      f.createPropertyAssignment(
        f.createStringLiteral('@typescript-eslint/no-unused-vars'),
        f.createArrayLiteralExpression(
          [
            f.createStringLiteral('warn'),
            f.createObjectLiteralExpression(
              [
                f.createPropertyAssignment(
                  f.createIdentifier('argsIgnorePattern'),
                  f.createStringLiteral('^_')
                ),
              ],
              true
            ),
          ],
          true
        )
      ),
      f.createPropertyAssignment(
        f.createStringLiteral('jest/valid-title'),
        f.createStringLiteral('off')
      ),
    ],
    true
  );
}
