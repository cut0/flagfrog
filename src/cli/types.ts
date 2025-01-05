import type { Command } from "commander";
import type inquirer from "inquirer";
import type { SourceFile } from "ts-morph";
import type { createAstContext } from "./ast";
import type { FLAG_HANDLER, FLAG_RENDERER, FLAG_SWITCHER } from "./constants";
import type { createUsecases } from "./usecases";

export type AstContext = ReturnType<typeof createAstContext>;

export type Context = {
  command: Command;
  inquirer: typeof inquirer;
  usecases: ReturnType<typeof createUsecases>;
};

export type FlagToolTypes =
  | typeof FLAG_HANDLER
  | typeof FLAG_SWITCHER
  | typeof FLAG_RENDERER;

export type FlagToolByPath = Record<
  //path
  string,
  {
    source: SourceFile;
    toolMap: {
      hasHandler: boolean;
      hasSwitcher: boolean;
      hasRenderer: boolean;
    };
  }
>;

export type PathListByFlag = Record<
  // flag
  string,
  {
    path: string;
    source: SourceFile;
    toolMap: {
      hasHandler: boolean;
      hasSwitcher: boolean;
      hasRenderer: boolean;
    };
  }[]
>;
