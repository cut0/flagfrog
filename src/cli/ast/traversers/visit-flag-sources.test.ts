import assert from "node:assert";
import { describe, test } from "node:test";
import { Project } from "ts-morph";
import { FLAG_HANDLER, FLAG_RENDERER, FLAG_SWITCHER } from "../../constants";
import { createVisitFlagSources } from "./visit-flag-sources";

const LIB_NAME = "flag-tools";

describe(createVisitFlagSources.name, () => {
  test("Should handle no imports from flag-tools", ({ mock }) => {
    const project = new Project();
    project.createSourceFile(
      "file3.ts",
      `
    import { somethingElse } from 'another-lib';
  `,
    );

    const onVisit = mock.fn();

    createVisitFlagSources(project)({ target: "file3.ts", onVisit });

    assert.deepStrictEqual(onVisit.mock.calls, []);
  });

  test("Should find FLAG_HANDLER import", ({ mock }) => {
    const project = new Project();
    const source = project.createSourceFile(
      "file1.ts",
      `
    import { ${FLAG_HANDLER} } from '${LIB_NAME}';
  `,
    );

    const onVisit = mock.fn();

    createVisitFlagSources(project)({ target: "file1.ts", onVisit });

    assert.equal(onVisit.mock.calls.length, 1);
    assert.deepStrictEqual(onVisit.mock.calls[0]?.arguments, [
      FLAG_HANDLER,
      source,
    ]);
  });

  test("Should find FLAG_RENDERER and FLAG_SWITCHER imports", (t) => {
    const project = new Project();
    const source = project.createSourceFile(
      "file2.ts",
      `
    import { ${FLAG_RENDERER}, ${FLAG_SWITCHER} } from '${LIB_NAME}';
  `,
    );

    const onVisit = t.mock.fn();

    createVisitFlagSources(project)({ target: "file2.ts", onVisit });

    assert.equal(onVisit.mock.calls.length, 2);
    assert.deepStrictEqual(onVisit.mock.calls[0]?.arguments, [
      FLAG_RENDERER,
      source,
    ]);
    assert.deepStrictEqual(onVisit.mock.calls[1]?.arguments, [
      FLAG_SWITCHER,
      source,
    ]);
  });

  test("Should handle multiple files with mixed imports", (t) => {
    const project = new Project();
    const source4 = project.createSourceFile(
      "file4.ts",
      `
    import { ${FLAG_HANDLER} } from '${LIB_NAME}';
  `,
    );
    const source5 = project.createSourceFile(
      "file5.ts",
      `
    import { ${FLAG_RENDERER} } from '${LIB_NAME}';
  `,
    );

    const onVisit = t.mock.fn();

    createVisitFlagSources(project)({ target: "**/*.ts", onVisit });

    assert.equal(onVisit.mock.calls.length, 2);
    assert.deepStrictEqual(onVisit.mock.calls[0]?.arguments, [
      FLAG_HANDLER,
      source4,
    ]);
    assert.deepStrictEqual(onVisit.mock.calls[1]?.arguments, [
      FLAG_RENDERER,
      source5,
    ]);
  });
});
