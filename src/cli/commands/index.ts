import type { Context } from "../types";
import { createListCommand } from "./list";
import { createRemoveCommand } from "./remove";

export const createCommand = (context: Context) => {
  createListCommand(context);
  createRemoveCommand(context);
};
