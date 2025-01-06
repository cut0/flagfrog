import assert from "node:assert";
import { describe, test } from "node:test";
import { Project } from "ts-morph";
import { createRemoveFlagRenderer } from "./remove-renderer";

describe(createRemoveFlagRenderer.name, () => {
  test("Should throw error if name is missing", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.tsx",
      `
    <FlagRenderer on="Hoge" />
  `,
    );

    assert.throws(
      () =>
        createRemoveFlagRenderer(project)({
          source,
          flag: "text",
          flagState: "on",
        }),
      /name is required/,
    );
  });

  test("Should throw error if on is missing", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.tsx",
      `
    <FlagRenderer name="text" />
  `,
    );

    assert.throws(
      () =>
        createRemoveFlagRenderer(project)({
          source,
          flag: "text",
          flagState: "on",
        }),
      /on prop is required/,
    );
  });

  test("Should handle name as string literal", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.tsx",
      `
    <FlagRenderer name="text" on="Hoge" />
  `,
    );

    createRemoveFlagRenderer(project)({
      source,
      flag: "text",
      flagState: "on",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "Hoge");
  });

  test("Should handle name as JsxExpression", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.tsx",
      `
    <FlagRenderer name={"text"} on={<Hoge />} />
  `,
    );

    createRemoveFlagRenderer(project)({
      source,
      flag: "text",
      flagState: "on",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "<Hoge />");
  });

  test("Should handle on as string literal with JSX expression", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.tsx",
      `
    <FlagRenderer name="text" on={"Hoge"} />
  `,
    );

    createRemoveFlagRenderer(project)({
      source,
      flag: "text",
      flagState: "on",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "Hoge");
  });

  test("Should handle on as JSX element", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.tsx",
      `
    <FlagRenderer name="text" on={<Hoge />} />
  `,
    );

    createRemoveFlagRenderer(project)({
      source,
      flag: "text",
      flagState: "on",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "<Hoge />");
  });

  test("Should handle other cases for on", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.tsx",
      `
    <FlagRenderer name="text" on={Hoge} />
  `,
    );

    createRemoveFlagRenderer(project)({
      source,
      flag: "text",
      flagState: "on",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "<>{Hoge}</>");
  });

  test("Should handle on as string literal", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.tsx",
      `
    <FlagRenderer name="text" on="Hoge" />
  `,
    );

    createRemoveFlagRenderer(project)({
      source,
      flag: "text",
      flagState: "on",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "Hoge");
  });
});
