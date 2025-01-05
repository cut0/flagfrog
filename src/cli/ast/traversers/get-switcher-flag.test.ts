import assert from "node:assert";
import path from "node:path";
import { describe, test } from "node:test";
import { Project } from "ts-morph";
import { createGetSwitcherFlags } from "./get-switcher-flag";

describe(createGetSwitcherFlags.name, () => {
  test("Should return correct flag names", () => {
    const project = new Project();
    const sourceFile = project.createSourceFile(
      "test.ts",
      `
      flagSwitcher({ name: 'FlagA' });
      flagSwitcher({ name: 'FlagA' });
      flagSwitcher({ name: 'FlagB' });
      flagSwitcher({ name: "FlagC" });
    `,
    );

    assert.deepStrictEqual(createGetSwitcherFlags(project)(sourceFile), {
      path: path.resolve("test.ts"),
      flags: ["FlagA", "FlagB", "FlagC"],
    });
  });
});
