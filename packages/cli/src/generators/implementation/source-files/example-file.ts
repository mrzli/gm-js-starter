import ts from 'typescript';
import { tsStatementsToFileString } from '../../utils/generator-utils';

export function createExampleFile(): string {
  const statements = createExampleFileSyntaxTree();
  return tsStatementsToFileString(statements);
}

function createExampleFileSyntaxTree(): readonly ts.Statement[] {
  const f = ts.factory;
  return [
    f.createFunctionDeclaration(
      undefined,
      [f.createModifier(ts.SyntaxKind.ExportKeyword)],
      undefined,
      f.createIdentifier('add'),
      undefined,
      [
        f.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          f.createIdentifier('first'),
          undefined,
          f.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
          undefined
        ),
        f.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          f.createIdentifier('second'),
          undefined,
          f.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
          undefined
        )
      ],
      f.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
      f.createBlock(
        [
          f.createReturnStatement(
            f.createBinaryExpression(
              f.createIdentifier('first'),
              f.createToken(ts.SyntaxKind.PlusToken),
              f.createIdentifier('second')
            )
          )
        ],
        true
      )
    )
  ];
}
