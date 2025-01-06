import path from "node:path";
import { globSync } from "glob";
import type { Project, SourceFile } from "ts-morph";
import {
  FLAG_HANDLER,
  FLAG_RENDERER,
  FLAG_SWITCHER,
  LIBRARY_NAME,
} from "../../constants";
import type { FlagToolTypes } from "../../types";

type Args = {
  target: string;
  onVisit: (toolType: FlagToolTypes, sourceFile: SourceFile) => void;
};

export const createVisitFlagSources =
  (project: Project) =>
  ({ target, onVisit }: Args): void => {
    const filePaths = globSync(target, {
      ignore: ["node_modules/**", "dist/**"],
    });

    for (const filePath of filePaths) {
      project.addSourceFileAtPath(path.resolve(process.cwd(), filePath));
    }

    for (const sourceFile of project.getSourceFiles()) {
      for (const importDeclaration of sourceFile.getImportDeclarations()) {
        const moduleSpecifier = importDeclaration.getModuleSpecifierValue();

        if (moduleSpecifier === LIBRARY_NAME) {
          /**
           * NOTE:
           * - import { FLAG_RENDERER, FLAG_HANDLER } from 'flagfrog';
           */
          const namedImports = importDeclaration.getNamedImports();

          for (const namedImport of namedImports) {
            const name = namedImport.getName();

            switch (name) {
              case FLAG_HANDLER:
                onVisit(FLAG_HANDLER, sourceFile);
                break;
              case FLAG_SWITCHER:
                onVisit(FLAG_SWITCHER, sourceFile);
                break;
              case FLAG_RENDERER:
                onVisit(FLAG_RENDERER, sourceFile);
                break;
            }
          }
        }
      }
    }
  };
