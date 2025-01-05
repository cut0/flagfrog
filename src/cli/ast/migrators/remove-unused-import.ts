import { type Project, SyntaxKind } from "ts-morph";

export const createRemoveUnusedImports = (project: Project) => () => {
  const sourceFiles = project.getSourceFiles();

  for (const sourceFile of sourceFiles) {
    const importDeclarations = sourceFile.getImportDeclarations();

    for (const importDeclaration of importDeclarations) {
      const namedImports = importDeclaration.getNamedImports();

      for (const namedImport of namedImports) {
        const isUsed =
          namedImport
            .getFirstChildByKindOrThrow(SyntaxKind.Identifier)
            .findReferences().length > 0;

        if (!isUsed) {
          namedImport.remove();
        }
      }

      if (importDeclaration.getNamedImports().length === 0) {
        importDeclaration.remove();
      }
    }
  }
};
