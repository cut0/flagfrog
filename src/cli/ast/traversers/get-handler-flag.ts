import type { Project, SourceFile } from "ts-morph";
import { SyntaxKind } from "ts-morph";
import { FLAG_HANDLER } from "../../constants";

export const createGetHandlerFlags =
  (_: Project) =>
  (
    sourceFile: SourceFile,
  ): {
    path: string;
    flags: string[];
  } => {
    const flags: string[] = [];

    sourceFile.forEachDescendant((node) => {
      if (node.getKind() === SyntaxKind.CallExpression) {
        const callExpression = node.asKindOrThrow(SyntaxKind.CallExpression);
        const expression = callExpression.getExpression();

        if (expression.getText() === FLAG_HANDLER) {
          const args = callExpression.getArguments();

          if (
            args.length === 1 &&
            args[0] != null &&
            args[0].getKind() === SyntaxKind.ObjectLiteralExpression
          ) {
            const objectLiteral = args[0].asKindOrThrow(
              SyntaxKind.ObjectLiteralExpression,
            );

            const nameProperty = objectLiteral
              .getProperties()
              .map((prop) => {
                if (prop.getKind() === SyntaxKind.PropertyAssignment) {
                  const assignment = prop.asKindOrThrow(
                    SyntaxKind.PropertyAssignment,
                  );
                  return {
                    name: assignment.getNameNode().getText(),
                    value: assignment.getInitializer(),
                  };
                }
              })
              .find((prop) => prop?.name === "name");

            if (nameProperty?.value != null) {
              flags.push(nameProperty.value.getText().replace(/['"]+/g, ""));
            }
          }
        }
      }
    });

    return {
      path: sourceFile.getFilePath(),
      flags: [...new Set(flags)],
    };
  };
