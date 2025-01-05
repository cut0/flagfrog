import assert from "node:assert";
import { describe, test } from "node:test";
import { Project } from "ts-morph";
import { createRemoveFlagHandler } from "./remove-handler";

describe(createRemoveFlagHandler.name, () => {
  test("Should throw an error if name is missing", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.ts",
      `
    flagHandler({ });
  `,
    );

    assert.throws(
      () =>
        createRemoveFlagHandler(project)({
          source,
          flag: "test",
          actionName: "enableAction",
        }),
      /name is required/,
    );
  });

  test("Should throw an error if enableAction is missing", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.ts",
      `
    flagHandler({ name: "test" });
  `,
    );

    assert.throws(
      () =>
        createRemoveFlagHandler(project)({
          source,
          flag: "test",
          actionName: "enableAction",
        }),
      /enableAction is required/,
    );
  });

  test("Should replace flagHandler with enableAction function call", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.ts",
      `
    flagHandler({ name: "test", enableAction: handleExample });
  `,
    );

    createRemoveFlagHandler(project)({
      source,
      flag: "test",
      actionName: "enableAction",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "handleExample();");
  });

  test("Should handle arrow function correctly when assigned to a variable", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.ts",
      `
    const flag = flagHandler({ name: "test", enableAction: () => handleExample() });
  `,
    );

    createRemoveFlagHandler(project)({
      source,
      flag: "test",
      actionName: "enableAction",
    });

    const result = source.getText();
    assert.strictEqual(
      result.trim(),
      "const flag = (() => handleExample())();",
    );
  });

  test("Should handle arrow function correctly when not assigned to a variable", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.ts",
      `
    flagHandler({ name: "test", enableAction: () => { handleExample(); handleExample(); } });
  `,
    );

    createRemoveFlagHandler(project)({
      source,
      flag: "test",
      actionName: "enableAction",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "handleExample(); handleExample();");
  });

  test("Should not handle name is anything else.", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.ts",
      `
    flagHandler({ name: "test", enableAction: handleExample });
  `,
    );

    createRemoveFlagHandler(project)({
      source,
      flag: "other",
      actionName: "enableAction",
    });

    const result = source.getText();
    assert.strictEqual(
      result.trim(),
      'flagHandler({ name: "test", enableAction: handleExample });',
    );
  });
});
