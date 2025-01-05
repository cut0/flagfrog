import type { AstContext, FlagToolByPath, PathListByFlag } from "../types";

export const createToPathListByFlag =
  ({ traversers }: AstContext) =>
  (flagToolByPath: FlagToolByPath): PathListByFlag => {
    return Object.entries(flagToolByPath).reduce<PathListByFlag>(
      (acc, [filePath, { toolMap, source }]) => {
        const flags = [
          ...(toolMap.hasHandler
            ? traversers.getHandlerFlags(source).flags
            : []),
          ...(toolMap.hasSwitcher
            ? traversers.getSwitcherFlags(source).flags
            : []),
          ...(toolMap.hasRenderer
            ? traversers.getRendererFlags(source).flags
            : []),
        ];

        for (const flag of flags) {
          if (acc[flag] == null) {
            acc[flag] = [];
          }
          if (acc[flag].every(({ path }) => path !== filePath)) {
            acc[flag].push({ path: filePath, source, toolMap });
          }
        }

        return acc;
      },
      {},
    );
  };
