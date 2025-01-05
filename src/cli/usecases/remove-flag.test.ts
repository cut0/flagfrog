import assert from "node:assert";
import test, { describe } from "node:test";
import { Project } from "ts-morph";
import { createRemoveFlag } from "./remove-flag";

const project = new Project();

const pathListByFlag = {
  flag: [
    {
      path: "test1.ts",
      source: project.createSourceFile("test1.ts", "test1"),
      toolMap: {
        hasHandler: true,
        hasSwitcher: true,
        hasRenderer: true,
      },
    },
    {
      path: "test2.ts",
      source: project.createSourceFile("test2.ts", "test2"),
      toolMap: {
        hasHandler: true,
        hasSwitcher: false,
        hasRenderer: true,
      },
    },
    {
      path: "test3.ts",
      source: project.createSourceFile("test3.ts", "test3"),
      toolMap: {
        hasHandler: false,
        hasSwitcher: false,
        hasRenderer: true,
      },
    },
    {
      path: "test4.ts",
      source: project.createSourceFile("test4.ts", "test4"),
      toolMap: {
        hasHandler: false,
        hasSwitcher: false,
        hasRenderer: false,
      },
    },
  ] as const,
};

describe(createRemoveFlag.name, () => {
  test("Should dispatch removers (enabled)", (t) => {
    const removeFlagHandler = t.mock.fn();
    const removeFlagSwitcher = t.mock.fn();
    const removeFlagRenderer = t.mock.fn();
    const removeUnusedImports = t.mock.fn();
    const applyMigration = t.mock.fn();

    createRemoveFlag({
      migrators: {
        removeFlagHandler,
        removeFlagSwitcher,
        removeFlagRenderer,
        removeUnusedImports,
        applyMigration,
      },
    } as never)({
      flag: "flag",
      pathListByFlag,
      enabled: true,
    } as never);

    assert.equal(removeFlagHandler.mock.calls.length, 2);
    assert.deepStrictEqual(removeFlagHandler.mock.calls[0]?.arguments, [
      {
        source: pathListByFlag.flag[0].source,
        flag: "flag",
        actionName: "enableAction",
      },
    ]);
    assert.deepStrictEqual(removeFlagHandler.mock.calls[1]?.arguments, [
      {
        source: pathListByFlag.flag[1].source,
        flag: "flag",
        actionName: "enableAction",
      },
    ]);
    assert.equal(removeFlagSwitcher.mock.calls.length, 1);
    assert.deepStrictEqual(removeFlagSwitcher.mock.calls[0]?.arguments, [
      {
        source: pathListByFlag.flag[0].source,
        flag: "flag",
        optionName: "enableOption",
      },
    ]);
    assert.equal(removeFlagRenderer.mock.calls.length, 3);
    assert.deepStrictEqual(removeFlagRenderer.mock.calls[0]?.arguments, [
      {
        source: pathListByFlag.flag[0].source,
        flag: "flag",
        propName: "enableComponent",
      },
    ]);
    assert.deepStrictEqual(removeFlagRenderer.mock.calls[1]?.arguments, [
      {
        source: pathListByFlag.flag[1].source,
        flag: "flag",
        propName: "enableComponent",
      },
    ]);
    assert.deepStrictEqual(removeFlagRenderer.mock.calls[2]?.arguments, [
      {
        source: pathListByFlag.flag[2].source,
        flag: "flag",
        propName: "enableComponent",
      },
    ]);
    assert.equal(removeUnusedImports.mock.calls.length, 1);
    assert.equal(applyMigration.mock.calls.length, 1);
  });

  test("Should dispatch removers (disabled)", (t) => {
    const removeFlagHandler = t.mock.fn();
    const removeFlagSwitcher = t.mock.fn();
    const removeFlagRenderer = t.mock.fn();
    const removeUnusedImports = t.mock.fn();
    const applyMigration = t.mock.fn();

    createRemoveFlag({
      migrators: {
        removeFlagHandler,
        removeFlagSwitcher,
        removeFlagRenderer,
        removeUnusedImports,
        applyMigration,
      },
    } as never)({
      flag: "flag",
      pathListByFlag,
      enabled: false,
    } as never);

    assert.equal(removeFlagHandler.mock.calls.length, 2);
    assert.deepStrictEqual(removeFlagHandler.mock.calls[0]?.arguments, [
      {
        source: pathListByFlag.flag[0].source,
        flag: "flag",
        actionName: "disableAction",
      },
    ]);
    assert.deepStrictEqual(removeFlagHandler.mock.calls[1]?.arguments, [
      {
        source: pathListByFlag.flag[1].source,
        flag: "flag",
        actionName: "disableAction",
      },
    ]);
    assert.equal(removeFlagSwitcher.mock.calls.length, 1);
    assert.deepStrictEqual(removeFlagSwitcher.mock.calls[0]?.arguments, [
      {
        source: pathListByFlag.flag[0].source,
        flag: "flag",
        optionName: "disableOption",
      },
    ]);
    assert.equal(removeFlagRenderer.mock.calls.length, 3);
    assert.deepStrictEqual(removeFlagRenderer.mock.calls[0]?.arguments, [
      {
        source: pathListByFlag.flag[0].source,
        flag: "flag",
        propName: "disableComponent",
      },
    ]);
    assert.deepStrictEqual(removeFlagRenderer.mock.calls[1]?.arguments, [
      {
        source: pathListByFlag.flag[1].source,
        flag: "flag",
        propName: "disableComponent",
      },
    ]);
    assert.deepStrictEqual(removeFlagRenderer.mock.calls[2]?.arguments, [
      {
        source: pathListByFlag.flag[2].source,
        flag: "flag",
        propName: "disableComponent",
      },
    ]);
    assert.equal(removeUnusedImports.mock.calls.length, 1);
    assert.equal(applyMigration.mock.calls.length, 1);
  });

  test("Should not dispatch removers (no flag)", (t) => {
    const removeFlagHandler = t.mock.fn();
    const removeFlagSwitcher = t.mock.fn();
    const removeFlagRenderer = t.mock.fn();
    const removeUnusedImports = t.mock.fn();
    const applyMigration = t.mock.fn();

    createRemoveFlag({
      migrators: {
        removeFlagHandler,
        removeFlagSwitcher,
        removeFlagRenderer,
        removeUnusedImports,
        applyMigration,
      },
    } as never)({
      flag: "flag1",
      pathListByFlag,
      enabled: true,
    } as never);

    assert.equal(removeFlagHandler.mock.calls.length, 0);
    assert.equal(removeFlagSwitcher.mock.calls.length, 0);
    assert.equal(removeFlagRenderer.mock.calls.length, 0);
    assert.equal(removeUnusedImports.mock.calls.length, 0);
    assert.equal(applyMigration.mock.calls.length, 0);
  });
});
