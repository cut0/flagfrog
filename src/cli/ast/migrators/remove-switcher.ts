import type { Project, SourceFile } from "ts-morph";
import { SyntaxKind } from "ts-morph";
import { FLAG_SWITCHER } from "../../constants";

type Args = {
  source: SourceFile;
  flag: string;
  flagState: "on" | "off";
};

export const createRemoveFlagSwitcher =
  (_: Project) =>
  ({ source, flag, flagState }: Args) => {
    source.forEachDescendant((node) => {
      if (node.getKind() === SyntaxKind.CallExpression) {
        const callExpression = node.asKindOrThrow(SyntaxKind.CallExpression);
        const expression = callExpression.getExpression();

        if (expression.getText() === FLAG_SWITCHER) {
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
              if (targetProperty?.value == null) {
                throw new Error(`${flagState} is required`);
              }
              /**
               * NOTE:
               * - from: const flag = flagSwitcher({ on: option });
               * - to: const flag = option;
               *
               * Special case for spread syntax:
               * - from: const res = [...flagSwitcher({ on: [1,2,3], off: [4,5,6] })];
               * - to: const res = [1,2,3];
               */
              const parent = callExpression.getParent();
              if (parent?.getKind() === SyntaxKind.SpreadElement) {
                // Handle spread syntax case
                const spreadElement = parent.asKindOrThrow(
                  SyntaxKind.SpreadElement,
                );
                const arrayLiteral = spreadElement.getParent();
                if (
                  arrayLiteral?.getKind() === SyntaxKind.ArrayLiteralExpression
                ) {
                  // Replace the entire array literal with the target property value
                  arrayLiteral.replaceWithText(targetProperty.value.getText());
                } else {
                  // Fallback: just replace the spread element
                  spreadElement.replaceWithText(targetProperty.value.getText());
                }
              } else {
                // Normal case: replace the call expression
                callExpression.replaceWithText(targetProperty.value.getText());
              }
              return;
            }
          }
        }
      }
    });
  };
