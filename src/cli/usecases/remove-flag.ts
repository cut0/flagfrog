import type { AstContext, PathListByFlag } from "../types";

type Args = {
  flag: string;
  pathListByFlag: PathListByFlag;
  flagState: "on" | "off";
};

export const createRemoveFlag =
  ({ migrators }: AstContext) =>
  ({ flag, pathListByFlag, flagState }: Args): void => {
    const pathList = pathListByFlag[flag];

    if (pathList == null) {
      return;
    }

    for (const { source, toolMap } of pathList) {
      if (toolMap.hasHandler) {
        migrators.removeFlagHandler({
          source,
          flag,
          flagState,
        });
      }
      if (toolMap.hasSwitcher) {
        migrators.removeFlagSwitcher({
          source,
          flag,
          flagState,
        });
      }
      if (toolMap.hasRenderer) {
        migrators.removeFlagRenderer({
          source,
          flag,
          flagState,
        });
      }
      migrators.removeUnusedImports(source);
    }

    migrators.applyMigration();
  };
