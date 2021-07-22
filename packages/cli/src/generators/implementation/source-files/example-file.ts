import ts from 'typescript';

export function createSourceFile(): string {
  const f = ts.factory;
  const statement = createExampleFileSyntaxTree();
  const sourceFile = f.createSourceFile(
    [statement],
    f.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  return printer.printFile(sourceFile);
}

function createExampleFileSyntaxTree(): ts.Statement {
  const f = ts.factory;
  return f.createFunctionDeclaration(
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
  );
}
