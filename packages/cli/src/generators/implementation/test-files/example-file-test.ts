import ts from 'typescript';
import {
  tsCreateEmptyLinePlaceholder,
  tsStatementsToFileString
} from '../../utils/generator-utils';
import { CreateExampleFileTestInput } from '../../../types/generators/inputs/create-example-file-test-input';

export function createExampleTestFile(
  input: CreateExampleFileTestInput
): string {
  const statements = createExampleTestFileSyntaxTree();
  return tsStatementsToFileString(statements, input.prettierConfig);
}

function createExampleTestFileSyntaxTree(): readonly ts.Statement[] {
  const f = ts.factory;
  return [
    f.createImportDeclaration(
      undefined,
      undefined,
      f.createImportClause(
        false,
        undefined,
        f.createNamedImports([
          f.createImportSpecifier(undefined, f.createIdentifier('add'))
        ])
      ),
      f.createStringLiteral('../../src/example')
    ),
    tsCreateEmptyLinePlaceholder(),
    f.createExpressionStatement(
      f.createCallExpression(f.createIdentifier('describe'), undefined, [
        f.createStringLiteral('example'),
        f.createArrowFunction(
          undefined,
          undefined,
          [],
          undefined,
          f.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          f.createBlock(
            [
              f.createExpressionStatement(
                f.createCallExpression(f.createIdentifier('it'), undefined, [
                  f.createStringLiteral('add()'),
                  f.createArrowFunction(
                    undefined,
                    undefined,
                    [],
                    undefined,
                    f.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                    f.createBlock(
                      [
                        f.createVariableStatement(
                          undefined,
                          f.createVariableDeclarationList(
                            [
                              f.createVariableDeclaration(
                                f.createIdentifier('actual'),
                                undefined,
                                undefined,
                                f.createCallExpression(
                                  f.createIdentifier('add'),
                                  undefined,
                                  [
                                    f.createNumericLiteral('1'),
                                    f.createNumericLiteral('2')
                                  ]
                                )
                              )
                            ],
                            ts.NodeFlags.Const
                          )
                        ),
                        f.createExpressionStatement(
                          f.createCallExpression(
                            f.createPropertyAccessExpression(
                              f.createCallExpression(
                                f.createIdentifier('expect'),
                                undefined,
                                [f.createIdentifier('actual')]
                              ),
                              f.createIdentifier('toEqual')
                            ),
                            undefined,
                            [f.createNumericLiteral('3')]
                          )
                        )
                      ],
                      true
                    )
                  )
                ])
              )
            ],
            true
          )
        )
      ])
    )
  ];
}
