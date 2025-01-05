import type { Project } from "ts-morph";

export const createApplyMigration =
  (project: Project) =>
  (dryRun = false): void => {
    if (dryRun) {
      console.log("Running in dry mode");
    }
    project.saveSync();
  };
