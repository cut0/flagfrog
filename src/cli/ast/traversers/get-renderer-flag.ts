import type { JsxExpression, Project, SourceFile } from "ts-morph";
import { SyntaxKind } from "ts-morph";
import { FLAG_RENDERER } from "../../constants";

export const createGetRendererFlags =
  (_: Project) =>
  (
    sourceFile: SourceFile,
  ): {
    path: string;
    flags: string[];
  } => {
    const flags: string[] = [];

    sourceFile.forEachDescendant((node) => {
      if (node.getKind() === SyntaxKind.JsxSelfClosingElement) {
        const jsxElement = node.asKindOrThrow(SyntaxKind.JsxSelfClosingElement);
        const tagName = jsxElement.getTagNameNode().getText();

        if (tagName === FLAG_RENDERER) {
          const nameAttr = jsxElement
            .getAttributes()
            .map((attr) => {
              if (attr.getKind() === SyntaxKind.JsxAttribute) {
                const jsxAttr = attr.asKindOrThrow(SyntaxKind.JsxAttribute);
                return {
                  name: jsxAttr.getNameNode().getText(),
                  value: jsxAttr.getInitializer(),
                };
              }
            })
            .find((prop) => prop?.name === "name");

          if (nameAttr?.value == null) {
            return;
          }
          /**
           * NOTE:
           * - handle: <FlagRenderer name="example" />
           */
          if (nameAttr.value.getKind() === SyntaxKind.StringLiteral) {
            flags.push(
              nameAttr.value
                .asKindOrThrow(SyntaxKind.StringLiteral)
                .getText()
                .replace(/['"]+/g, ""),
            );
          }
          /**
           * NOTE:
           * - handle: <FlagRenderer name={"example"} />
           */
          if (nameAttr.value.getKind() === SyntaxKind.JsxExpression) {
            const jsxExpression = nameAttr.value as JsxExpression;
            const child = jsxExpression.getExpression();

            if (child?.getKind() === SyntaxKind.StringLiteral) {
              flags.push(
                child
                  .asKindOrThrow(SyntaxKind.StringLiteral)
                  .getText()
                  .replace(/['"]+/g, ""),
              );
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
