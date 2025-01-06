import type { Project, SourceFile } from "ts-morph";

export const createRemoveUnusedImports =
  (_: Project) => (source: SourceFile) => {
    source.fixUnusedIdentifiers();
  };
