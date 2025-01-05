import { Command } from "commander";
import inquirer from "inquirer";
import { Project } from "ts-morph";
import packageJson from "../../package.json" assert { type: "json" };
import { createAstContext } from "./ast";
import { createCommand } from "./commands";
import { createUsecases } from "./usecases";

const run = async () => {
  const command = new Command()
    .name(packageJson.name)
    .description(packageJson.description)
    .version(packageJson.version);

  createCommand({
    command,
    inquirer,
    usecases: createUsecases(createAstContext(new Project())),
  });

  command.parse(process.argv);
};

run();
