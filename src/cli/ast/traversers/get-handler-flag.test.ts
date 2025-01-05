import assert from "node:assert";
import path from "node:path";
import { describe, test } from "node:test";
import { Project } from "ts-morph";
import { createGetHandlerFlags } from "./get-handler-flag";

describe(createGetHandlerFlags.name, () => {
  test("Should return correct flag names", () => {
    const project = new Project();
    const sourceFile = project.createSourceFile(
      "test.ts",
      `
    flagHandler({ name: 'FlagA' });
    flagHandler({ name: 'FlagA' });
    flagHandler({ name: 'FlagB' });
    flagHandler({ name: "FlagC" });
  `,
    );

    assert.deepStrictEqual(createGetHandlerFlags(project)(sourceFile), {
      path: path.resolve("test.ts"),
      flags: ["FlagA", "FlagB", "FlagC"],
    });
  });
});
