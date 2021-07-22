import ts from 'typescript';
import { tsStatementsToFileString } from '../../utils/generator-utils';
import { CreateEslintrcJsInput } from '../../../types/file-generators/inputs/create-eslintrc-js-input';

export function createEslintrcJs(input: CreateEslintrcJsInput): string {
  const statements = createEslintrcJsSyntaxTree();
  return tsStatementsToFileString(statements, input.prettierConfig);
}

function createEslintrcJsSyntaxTree(): readonly ts.Statement[] {
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
                    f.createStringLiteral('tsconfig.eslint.json')
                  )
                ],
                true
              )
            ),
            f.createPropertyAssignment(
              f.createIdentifier('plugins'),
              f.createArrayLiteralExpression(
                [f.createStringLiteral('prettier')],
                false
              )
            ),
            f.createPropertyAssignment(
              f.createIdentifier('extends'),
              f.createArrayLiteralExpression(
                [
                  f.createStringLiteral('eslint:recommended'),
                  f.createStringLiteral(
                    'plugin:@typescript-eslint/recommended'
                  ),
                  f.createStringLiteral('plugin:prettier/recommended')
                ],
                true
              )
            ),
            f.createPropertyAssignment(
              f.createIdentifier('rules'),
              f.createObjectLiteralExpression(
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
                            )
                          ],
                          true
                        )
                      ],
                      true
                    )
                  ),
                  f.createPropertyAssignment(
                    f.createStringLiteral('jest/valid-title'),
                    f.createStringLiteral('off')
                  )
                ],
                true
              )
            )
          ],
          true
        )
      )
    )
  ];
}
