import type { AstContext } from "../types";
import { createGenFlagMap } from "./gen-flag-map";
import { createToPathListByFlag } from "./parse-flags";
import { createRemoveFlag } from "./remove-flag";

export const createUsecases = (astContext: AstContext) => {
  return {
    genFlagMap: createGenFlagMap(astContext),
    toPathListByFlag: createToPathListByFlag(astContext),
    removeFlag: createRemoveFlag(astContext),
  };
};
