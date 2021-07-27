import ts from 'typescript';
import {
  getGeneratedFilePrettierParser,
  tsStatementsToFileString,
} from '../../utils/generator-utils';
import { CreateJestConfigJsInput } from '../../../types/file-generators/inputs/create-jest-config-js-input';
import { GeneratedFileType } from '../../../types/base/generated-file-type';

export function createJestConfigJsFile(input: CreateJestConfigJsInput): string {
  const statements = createJestConfigJsSyntaxTree();
  return tsStatementsToFileString(statements, {
    ...input.prettierConfig,
    parser: getGeneratedFilePrettierParser(GeneratedFileType.JavaScript),
  });
}

function createJestConfigJsSyntaxTree(): readonly ts.Statement[] {
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
              f.createIdentifier('preset'),
              f.createStringLiteral('ts-jest')
            ),
            f.createPropertyAssignment(
              f.createIdentifier('globals'),
              f.createObjectLiteralExpression(
                [
                  f.createPropertyAssignment(
                    f.createStringLiteral('ts-jest'),
                    f.createObjectLiteralExpression(
                      [
                        f.createPropertyAssignment(
                          f.createIdentifier('tsConfig'),
                          f.createStringLiteral('<rootDir>/tsconfig.test.json')
                        ),
                      ],
                      true
                    )
                  ),
                ],
                true
              )
            ),
            f.createPropertyAssignment(
              f.createIdentifier('testEnvironment'),
              f.createStringLiteral('node')
            ),
            f.createPropertyAssignment(
              f.createIdentifier('testRegex'),
              f.createArrayLiteralExpression(
                [
                  f.createStringLiteral(
                    '/(?:test/automatic-tests)/.+\\.test\\.ts$'
                  ),
                ],
                false
              )
            ),
          ],
          true
        )
      )
    ),
  ];
}
