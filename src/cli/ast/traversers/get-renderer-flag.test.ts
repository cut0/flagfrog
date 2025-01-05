import assert from "node:assert";
import path from "node:path";
import { describe, test } from "node:test";
import { Project } from "ts-morph";
import { createGetRendererFlags } from "./get-renderer-flag";

describe(createGetRendererFlags.name, () => {
  test("Should return correct flag names", () => {
    const project = new Project();
    const sourceFile = project.createSourceFile(
      "test.tsx",
      `
      <FlagRenderer name="FlagA" />
      <FlagRenderer name="FlagA" />
      <FlagRenderer name="FlagB" />
      <FlagRenderer name={"FlagC"} />
      <FlagRenderer name={'FlagD'} />
  `,
    );

    assert.deepStrictEqual(createGetRendererFlags(project)(sourceFile), {
      path: path.resolve("test.tsx"),
      flags: ["FlagA", "FlagB", "FlagC", "FlagD"],
    });
  });
});
