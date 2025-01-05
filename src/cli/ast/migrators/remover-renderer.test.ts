import assert from "node:assert";
import { describe, test } from "node:test";
import { Project } from "ts-morph";
import { createRemoveFlagRenderer } from "./remover-renderer";

describe(createRemoveFlagRenderer.name, () => {
  test("Should throw error if name is missing", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.tsx",
      `
    <FlagRenderer enableComponent="Hoge" />
  `,
    );

    assert.throws(
      () =>
        createRemoveFlagRenderer(project)({
          source,
          flag: "text",
          propName: "enableComponent",
        }),
      /name is required/,
    );
  });

  test("Should throw error if enableComponent is missing", () => {
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
          propName: "enableComponent",
        }),
      /enableComponent prop is required/,
    );
  });

  test("Should handle name as string literal", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.tsx",
      `
    <FlagRenderer name="text" enableComponent="Hoge" />
  `,
    );

    createRemoveFlagRenderer(project)({
      source,
      flag: "text",
      propName: "enableComponent",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "Hoge");
  });

  test("Should handle name as JsxExpression", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.tsx",
      `
    <FlagRenderer name={"text"} enableComponent={<Hoge />} />
  `,
    );

    createRemoveFlagRenderer(project)({
      source,
      flag: "text",
      propName: "enableComponent",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "<Hoge />");
  });

  test("Should handle enableComponent as string literal with JSX expression", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.tsx",
      `
    <FlagRenderer name="text" enableComponent={"Hoge"} />
  `,
    );

    createRemoveFlagRenderer(project)({
      source,
      flag: "text",
      propName: "enableComponent",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "Hoge");
  });

  test("Should handle enableComponent as JSX element", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.tsx",
      `
    <FlagRenderer name="text" enableComponent={<Hoge />} />
  `,
    );

    createRemoveFlagRenderer(project)({
      source,
      flag: "text",
      propName: "enableComponent",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "<Hoge />");
  });

  test("Should handle other cases for enableComponent", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.tsx",
      `
    <FlagRenderer name="text" enableComponent={Hoge} />
  `,
    );

    createRemoveFlagRenderer(project)({
      source,
      flag: "text",
      propName: "enableComponent",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "<>{Hoge}</>");
  });

  test("Should handle enableComponent as string literal", () => {
    const project = new Project();
    const source = project.createSourceFile(
      "test.tsx",
      `
    <FlagRenderer name="text" enableComponent="Hoge" />
  `,
    );

    createRemoveFlagRenderer(project)({
      source,
      flag: "text",
      propName: "enableComponent",
    });

    const result = source.getText();
    assert.strictEqual(result.trim(), "Hoge");
  });
});
