import type { Context } from "../types";

export const createRemoveCommand = (context: Context) => {
  const {
    command,
    inquirer,
    usecases: { genFlagMap, toPathListByFlag, removeFlag },
  } = context;

  command
    .command("remove <target>")
    .description("Remove selected flag from files")
    .action((target: string) => {
      const flagToolByPath = genFlagMap(target);
      const pathListByFlag = toPathListByFlag(flagToolByPath);

      inquirer
        .prompt([
          {
            type: "list",
            name: "flag",
            message: "Select a remove flag",
            choices: Object.keys(pathListByFlag),
          },
          {
            type: "list",
            name: "enabled",
            message: "Convert it to true or false?",
            choices: ["enable", "disable"],
          },
        ])
        .then(({ flag, enabled }) => {
          removeFlag({ flag, pathListByFlag, enabled: enabled === "enable" });
          console.log(`Done! ${flag} is now ${enabled}`);
        });
    });
};
