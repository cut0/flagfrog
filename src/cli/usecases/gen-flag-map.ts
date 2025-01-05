import { FLAG_HANDLER, FLAG_RENDERER, FLAG_SWITCHER } from "../constants";
import type { AstContext, FlagToolByPath } from "../types";

export const createGenFlagMap =
  ({ traversers }: AstContext) =>
  (target: string): FlagToolByPath => {
    const result: FlagToolByPath = {};

    traversers.visitFlagSources({
      target,
      onVisit: (toolType, souceFile) => {
        const filePath = souceFile.getFilePath();

        if (result[filePath] == null) {
          result[filePath] = {
            source: souceFile,
            toolMap: {
              hasHandler: false,
              hasSwitcher: false,
              hasRenderer: false,
            },
          };
        }

        switch (toolType) {
          case FLAG_HANDLER:
            result[filePath] = {
              ...result[filePath],
              toolMap: {
                ...result[filePath].toolMap,
                hasHandler: true,
              },
            };
            break;
          case FLAG_SWITCHER:
            result[filePath] = {
              ...result[filePath],
              toolMap: {
                ...result[filePath].toolMap,
                hasSwitcher: true,
              },
            };
            break;
          case FLAG_RENDERER:
            result[filePath] = {
              ...result[filePath],
              toolMap: {
                ...result[filePath].toolMap,
                hasRenderer: true,
              },
            };
            break;
        }
      },
    });

    return result;
  };
