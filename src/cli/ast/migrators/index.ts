import type { Project } from "ts-morph";
import { createApplyMigration } from "./apply-migration";
import { createRemoveFlagHandler } from "./remove-handler";
import { createRemoveFlagRenderer } from "./remove-renderer";
import { createRemoveFlagSwitcher } from "./remove-switcher";
import { createRemoveUnusedImports } from "./remove-unused-import";

export const createMigrators = (project: Project) => ({
  applyMigration: createApplyMigration(project),
  removeFlagHandler: createRemoveFlagHandler(project),
  removeFlagSwitcher: createRemoveFlagSwitcher(project),
  removeFlagRenderer: createRemoveFlagRenderer(project),
  removeUnusedImports: createRemoveUnusedImports(project),
});
