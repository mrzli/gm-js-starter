import ts from 'typescript';
import {
  getGeneratedFilePrettierParser,
  tsCreateEmptyLinePlaceholder,
  tsStatementsToFileString,
} from '../../utils/generator-utils';
import { GeneratedFileType } from '../../../types/base/generated-file-type';
import { CreateExampleFileScriptInput } from '../../../types/file-generators/inputs/create-example-file-script-input';

export function createExampleScriptFile(
  input: CreateExampleFileScriptInput
): string {
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
      undefined,
      undefined,
      f.createIdentifier('exampleScript'),
      undefined,
      [],
      f.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
      f.createBlock(
        [
          f.createExpressionStatement(
            f.createCallExpression(
              f.createPropertyAccessExpression(
                f.createIdentifier('console'),
                f.createIdentifier('log')
              ),
              undefined,
              [f.createStringLiteral('This is an example script...')]
            )
          ),
        ],
        true
      )
    ),
    tsCreateEmptyLinePlaceholder(),
    f.createExpressionStatement(
      f.createCallExpression(f.createIdentifier('exampleScript'), undefined, [])
    ),
  ];
}
