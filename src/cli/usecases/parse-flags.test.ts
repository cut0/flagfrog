import assert from "node:assert";
import test, { describe } from "node:test";
import { Project } from "ts-morph";
import { createToPathListByFlag } from "./parse-flags";

const project = new Project();

const test1Source = project.createSourceFile("test1.ts", "test1");
const test2Source = project.createSourceFile("test2.ts", "test2");
const test3Source = project.createSourceFile("test3.ts", "test3");
const test4Source = project.createSourceFile("test4.ts", "test4");
const test5Source = project.createSourceFile("test5.ts", "test5");

const flagToolByPath = {
  "test1.ts": {
    source: test1Source,
    toolMap: {
      hasHandler: true,
      hasSwitcher: false,
      hasRenderer: true,
    },
  },
  "test2.ts": {
    source: test2Source,
    toolMap: {
      hasHandler: true,
      hasSwitcher: false,
      hasRenderer: false,
    },
  },
  "test3.ts": {
    source: test3Source,
    toolMap: {
      hasHandler: false,
      hasSwitcher: false,
      hasRenderer: true,
    },
  },
  "test4.ts": {
    source: test4Source,
    toolMap: {
      hasHandler: false,
      hasSwitcher: false,
      hasRenderer: false,
    },
  },
  "test5.ts": {
    source: test5Source,
    toolMap: {
      hasHandler: true,
      hasSwitcher: false,
      hasRenderer: true,
    },
  },
};

const mockedGetHandlerFlags = () => {
  return {
    flags: ["flag1", "flag2"],
  };
};

const mockedGetSwitcherFlags = () => {
  return {
    flags: ["flag2", "flag3", "flag4"],
  };
};

const mockedGetRendererFlags = () => {
  return {
    flags: ["flag1", "flag3", "flag5"],
  };
};

describe(createToPathListByFlag.name, () => {
  test("Should generate flag map", () => {
    const traversers = {
      getHandlerFlags: mockedGetHandlerFlags,
      getSwitcherFlags: mockedGetSwitcherFlags,
      getRendererFlags: mockedGetRendererFlags,
    };

    const result = createToPathListByFlag({ traversers } as never)(
      flagToolByPath,
    );

    assert.deepStrictEqual(result, {
      flag1: [
        {
          path: "test1.ts",
          source: test1Source,
          toolMap: {
            hasHandler: true,
            hasSwitcher: false,
            hasRenderer: true,
          },
        },
        {
          path: "test2.ts",
          source: test2Source,
          toolMap: {
            hasHandler: true,
            hasSwitcher: false,
            hasRenderer: false,
          },
        },
        {
          path: "test3.ts",
          source: test3Source,
          toolMap: {
            hasHandler: false,
            hasSwitcher: false,
            hasRenderer: true,
          },
        },
        {
          path: "test5.ts",
          source: test5Source,
          toolMap: {
            hasHandler: true,
            hasSwitcher: false,
            hasRenderer: true,
          },
        },
      ],
      flag2: [
        {
          path: "test1.ts",
          source: test1Source,
          toolMap: {
            hasHandler: true,
            hasSwitcher: false,
            hasRenderer: true,
          },
        },
        {
          path: "test2.ts",
          source: test2Source,
          toolMap: {
            hasHandler: true,
            hasSwitcher: false,
            hasRenderer: false,
          },
        },
        {
          path: "test5.ts",
          source: test5Source,
          toolMap: {
            hasHandler: true,
            hasSwitcher: false,
            hasRenderer: true,
          },
        },
      ],
      flag3: [
        {
          path: "test1.ts",
          source: test1Source,
          toolMap: {
            hasHandler: true,
            hasSwitcher: false,
            hasRenderer: true,
          },
        },
        {
          path: "test3.ts",
          source: test3Source,
          toolMap: {
            hasHandler: false,
            hasSwitcher: false,
            hasRenderer: true,
          },
        },
        {
          path: "test5.ts",
          source: test5Source,
          toolMap: {
            hasHandler: true,
            hasSwitcher: false,
            hasRenderer: true,
          },
        },
      ],
      flag5: [
        {
          path: "test1.ts",
          source: test1Source,
          toolMap: {
            hasHandler: true,
            hasSwitcher: false,
            hasRenderer: true,
          },
        },
        {
          path: "test3.ts",
          source: test3Source,
          toolMap: {
            hasHandler: false,
            hasSwitcher: false,
            hasRenderer: true,
          },
        },
        {
          path: "test5.ts",
          source: test5Source,
          toolMap: {
            hasHandler: true,
            hasSwitcher: false,
            hasRenderer: true,
          },
        },
      ],
    });
  });
});
