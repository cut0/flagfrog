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
          flagState: "on",
        }),
      /name is required/,
    );
  });

  test("Should throw an error if on is missing", () => {
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
          flagState: "on",
        }),
      /on is required/,
    );
  });

  test("Should replace flagSwitcher with on function call", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.ts",
      `
    const flag = flagSwitcher({ name: "test", on: option });
  `,
    );

    createRemoveFlagSwitcher(project)({
      source,
      flag: "test",
      flagState: "on",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "const flag = option;");
  });

  test("Should not handle name is anything else.", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.ts",
      `
    flagSwitcher({ name: "test", on: option });
  `,
    );

    createRemoveFlagSwitcher(project)({
      source,
      flag: "other",
      flagState: "on",
    });

    const result = source.getText();
    assert.strictEqual(
      result.trim(),
      'flagSwitcher({ name: "test", on: option });',
    );
  });

  test("Should handle spread syntax with array values", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.ts",
      `
    const res = [...flagSwitcher({ name: "test", on: [1, 2, 3], off: [4, 5, 6] })];
  `,
    );

    createRemoveFlagSwitcher(project)({
      source,
      flag: "test",
      flagState: "on",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "const res = [1, 2, 3];");
  });

  test("Should handle spread syntax with off state", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.ts",
      `
    const res = [...flagSwitcher({ name: "test", on: [1, 2, 3], off: [4, 5, 6] })];
  `,
    );

    createRemoveFlagSwitcher(project)({
      source,
      flag: "test",
      flagState: "off",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "const res = [4, 5, 6];");
  });
});
