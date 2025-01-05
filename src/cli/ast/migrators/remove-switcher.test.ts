import assert from "node:assert";
import { describe, test } from "node:test";
import { Project } from "ts-morph";
import { createRemoveFlagSwitcher } from "./remove-switcher";

describe(createRemoveFlagSwitcher.name, () => {
  test("Should throw an error if name is missing", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.ts",
      `
    flagSwitcher({ });
  `,
    );

    assert.throws(
      () =>
        createRemoveFlagSwitcher(project)({
          source,
          flag: "test",
          optionName: "enableOption",
        }),
      /name is required/,
    );
  });

  test("Should throw an error if enableOption is missing", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.ts",
      `
    flagSwitcher({ name: "test" });
  `,
    );

    assert.throws(
      () =>
        createRemoveFlagSwitcher(project)({
          source,
          flag: "test",
          optionName: "enableOption",
        }),
      /enableOption is required/,
    );
  });

  test("Should replace flagSwitcher with enableOption function call", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.ts",
      `
    const flag = flagSwitcher({ name: "test", enableOption: option });
  `,
    );

    createRemoveFlagSwitcher(project)({
      source,
      flag: "test",
      optionName: "enableOption",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "const flag = option;");
  });

  test("Should not handle name is anything else.", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.ts",
      `
    flagSwitcher({ name: "test", enableOption: option });
  `,
    );

    createRemoveFlagSwitcher(project)({
      source,
      flag: "other",
      optionName: "enableOption",
    });

    const result = source.getText();
    assert.strictEqual(
      result.trim(),
      'flagSwitcher({ name: "test", enableOption: option });',
    );
  });
});
