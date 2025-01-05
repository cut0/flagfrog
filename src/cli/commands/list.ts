import type { Context } from "../types";
import { printTree } from "../utils/printer";

export const createListCommand = (context: Context) => {
  const {
    command,
    inquirer,
    usecases: { genFlagMap, toPathListByFlag },
  } = context;

  command
    .command("list <target>")
    .description("Show files where flags are used")
    .action((target: string) => {
      const flagToolByPath = genFlagMap(target);
      const pathListByFlag = toPathListByFlag(flagToolByPath);

      inquirer
        .prompt<{
          flag: string;
        }>([
          {
            type: "list",
            name: "flag",
            message: "Select a flag",
            choices: ["ALL", ...Object.keys(pathListByFlag)],
          },
        ])
        .then(({ flag }) => {
          if (flag === "ALL") {
            for (const [flag, info] of Object.entries(pathListByFlag)) {
              printTree(
                flag,
                info.map(({ path }) => path),
              );
            }
          } else {
            printTree(
              flag,
              (pathListByFlag[flag] ?? []).map(({ path }) => path),
            );
          }
        });
    });
};
