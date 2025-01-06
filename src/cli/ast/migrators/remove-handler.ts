import type { Project, SourceFile } from "ts-morph";
import { SyntaxKind } from "ts-morph";
import { FLAG_HANDLER } from "../../constants";

type Args = {
  source: SourceFile;
  flag: string;
  flagState: "on" | "off";
};

export const createRemoveFlagHandler =
  (_: Project) =>
  ({ source, flag, flagState }: Args) => {
    source.forEachDescendant((node) => {
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

            const properties = objectLiteral
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
              .filter((prop) => prop != null);

            {
              const nameProperty = properties.find(
                (prop) => prop?.name === "name",
              );
              if (nameProperty == null || nameProperty.value == null) {
                throw new Error("name is required");
              }
              if (nameProperty.value.getText().replace(/['"]+/g, "") !== flag) {
                return;
              }
            }
            {
              const targetProperty = properties.find(
                (prop) => prop?.name === flagState,
              );
              if (targetProperty == null || targetProperty.value == null) {
                throw new Error(`${flagState} is required`);
              }
              /**
               * NOTE:
               * - from: flagHandler({ on: handleExample });
               * - to: handleExample();
               */
              if (targetProperty.value.getKind() === SyntaxKind.Identifier) {
                callExpression.replaceWithText(
                  `${targetProperty?.value.getText()}()`,
                );
                return;
              }
              if (targetProperty.value.getKind() === SyntaxKind.ArrowFunction) {
                const hasVariable =
                  node.getParent()?.getKind() ===
                  SyntaxKind.VariableDeclaration;
                /**
                 * NOTE:
                 * - from: const flag = flagHandler({ on: () => handleExample() });
                 * - to: cosnt flag = (() => handleExample())();
                 */
                if (hasVariable) {
                  const statement = targetProperty.value
                    .asKindOrThrow(SyntaxKind.ArrowFunction)
                    .getText();
                  callExpression.replaceWithText(`(${statement})()`);
                  return;
                }
                /**
                 * NOTE:
                 * - from: flagHandler({ on: () => { handleExample(); handleExample2(); } });
                 * - to: handleExample(); handleExample();
                 */
                const statement = targetProperty.value
                  .asKindOrThrow(SyntaxKind.ArrowFunction)
                  .getBodyText();
                node.getParent()?.replaceWithText(`${statement}`);
                return;
              }
            }
          }
        }
      }
    });
  };
