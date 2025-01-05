import type { Project, SourceFile } from "ts-morph";
import { SyntaxKind } from "ts-morph";
import { FLAG_SWITCHER } from "../../constants";

type Args = {
  source: SourceFile;
  flag: string;
  optionName: "enableOption" | "disableOption";
};

export const createRemoveFlagSwitcher =
  (_: Project) =>
  ({ source, flag, optionName }: Args) => {
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
                (prop) => prop?.name === optionName,
              );
              if (targetProperty?.value == null) {
                throw new Error(`${optionName} is required`);
              }
              /**
               * NOTE:
               * - from: const flag = flagSwitcher({ enableOption: option });
               * - to: const flag = option;
               */
              callExpression.replaceWithText(
                `${targetProperty.value.getText()}`,
              );
              return;
            }
          }
        }
      }
    });
  };
