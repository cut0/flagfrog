import type { Project } from "ts-morph";
import { createMigrators } from "./migrators";
import { createTraversers } from "./traversers";

export const createAstContext = (project: Project) => ({
  migrators: createMigrators(project),
  traversers: createTraversers(project),
});
