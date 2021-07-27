import ts from 'typescript';
import {
  getGeneratedFilePrettierParser,
  tsStatementsToFileString,
} from '../../utils/generator-utils';
import { CreateExampleFileSrcInput } from '../../../types/file-generators/inputs/create-example-file-src-input';
import { GeneratedFileType } from '../../../types/base/generated-file-type';

export function createExampleFile(input: CreateExampleFileSrcInput): string {
  const statements = createExampleFileSyntaxTree();
  return tsStatementsToFileString(statements, {
    ...input.prettierConfig,
    parser: getGeneratedFilePrettierParser(GeneratedFileType.TypeScript),
  });
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
        ),
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
          ),
        ],
        true
      )
    ),
  ];
}
