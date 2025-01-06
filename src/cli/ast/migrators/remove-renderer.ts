import type { JsxExpression, Project, SourceFile } from "ts-morph";
import { SyntaxKind } from "ts-morph";
import { FLAG_RENDERER } from "../../constants";

type Args = {
  source: SourceFile;
  flag: string;
  flagState: "on" | "off";
};

export const createRemoveFlagRenderer =
  (_: Project) =>
  ({ source, flag, flagState }: Args) => {
    source.forEachDescendant((node) => {
      if (node.getKind() === SyntaxKind.JsxSelfClosingElement) {
        const jsxElement = node.asKindOrThrow(SyntaxKind.JsxSelfClosingElement);
        const tagName = jsxElement.getTagNameNode().getText();

        if (tagName === FLAG_RENDERER) {
          const attrs = jsxElement.getAttributes().map((attr) => {
            if (attr.getKind() === SyntaxKind.JsxAttribute) {
              const jsxAttr = attr.asKindOrThrow(SyntaxKind.JsxAttribute);
              return {
                name: jsxAttr.getNameNode().getText(),
                value: jsxAttr.getInitializer(),
              };
            }
          });

          {
            const nameAttr = attrs.find((prop) => prop?.name === "name");
            if (nameAttr == null || nameAttr?.value == null) {
              throw new Error("name is required");
            }
            /**
             * NOTE:
             * - handle: <FlagRenderer name="example" />
             */
            if (nameAttr.value.getKind() === SyntaxKind.StringLiteral) {
              if (
                nameAttr.value
                  .asKindOrThrow(SyntaxKind.StringLiteral)
                  .getText()
                  .replace(/['"]+/g, "") !== flag
              ) {
                return;
              }
            }
            /**
             * NOTE:
             * - handle: <FlagRenderer name={"example"} />
             */
            if (nameAttr.value.getKind() === SyntaxKind.JsxExpression) {
              const jsxExpression = nameAttr.value as JsxExpression;
              const child = jsxExpression.getExpression();

              if (child?.getKind() === SyntaxKind.StringLiteral) {
                if (
                  child
                    .asKindOrThrow(SyntaxKind.StringLiteral)
                    .getText()
                    .replace(/['"]+/g, "") !== flag
                ) {
                  return;
                }
              }
            }
          }
          {
            const targetAttr = attrs.find((prop) => prop?.name === flagState);
            if (targetAttr == null || targetAttr?.value == null) {
              throw new Error(`${flagState} prop is required`);
            }

            if (targetAttr.value.getKind() === SyntaxKind.JsxExpression) {
              const jsxExpression = targetAttr.value.asKindOrThrow(
                SyntaxKind.JsxExpression,
              );
              const child = jsxExpression.getExpression();
              /**
               * NOTE:
               * - from: <FlagRenderer on={"Hoge"} />
               * - to: Hoge
               */
              if (child?.getKind() === SyntaxKind.StringLiteral) {
                jsxElement.replaceWithText(
                  child.getText().replace(/['"]+/g, ""),
                );
                return;
              }
              /**
               * NOTE:
               * - from: <FlagRenderer on={<Hoge />} />
               * - to: <Hoge />
               */
              if (
                child?.getKind() === SyntaxKind.JsxElement ||
                child?.getKind() === SyntaxKind.JsxSelfClosingElement ||
                child?.getKind() === SyntaxKind.JsxFragment ||
                child?.getKind() === SyntaxKind.JsxNamespacedName
              ) {
                jsxElement.replaceWithText(child?.getText() ?? "");
                return;
              }
              /**
               * NOTE:
               * ohters
               * - from: <FlagRenderer on={Hoge} />
               * - to: <>{Hoge}</>
               */
              jsxElement.replaceWithText(`<>${jsxExpression.getText()}</>`);
              return;
            }
            /**
             * NOTE:
             * - from: <FlagRenderer on="example" />
             * - to: example
             */
            jsxElement.replaceWithText(
              targetAttr.value.getText().replace(/['"]+/g, ""),
            );
            return;
          }
        }
      }
    });
  };
