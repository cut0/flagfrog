import type { AstContext, PathListByFlag } from "../types";

type Args = {
  flag: string;
  pathListByFlag: PathListByFlag;
  enabled: boolean;
};

export const createRemoveFlag =
  ({ migrators }: AstContext) =>
  ({ flag, pathListByFlag, enabled }: Args): void => {
    const pathList = pathListByFlag[flag];

    if (pathList == null) {
      return;
    }

    for (const { source, toolMap } of pathList) {
      if (toolMap.hasHandler) {
        migrators.removeFlagHandler({
          source,
          flag,
          actionName: enabled ? "enableAction" : "disableAction",
        });
      }
      if (toolMap.hasSwitcher) {
        migrators.removeFlagSwitcher({
          source,
          flag,
          optionName: enabled ? "enableOption" : "disableOption",
        });
      }
      if (toolMap.hasRenderer) {
        migrators.removeFlagRenderer({
          source,
          flag,
          propName: enabled ? "enableComponent" : "disableComponent",
        });
      }
    }

    migrators.removeUnusedImports();
    migrators.applyMigration();
  };
