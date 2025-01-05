import assert from "node:assert";
import test, { describe } from "node:test";
import { Project, type SourceFile } from "ts-morph";
import { FLAG_HANDLER, FLAG_RENDERER, FLAG_SWITCHER } from "../constants";
import type { FlagToolTypes } from "../types";
import { createGenFlagMap } from "./gen-flag-map";

const project = new Project();

const test1Source = project.createSourceFile("test1.ts", "test1");
const test2Source = project.createSourceFile("test2.ts", "test2");
const test3Source = project.createSourceFile("test3.ts", "test3");
const test4Source = project.createSourceFile("test4.ts", "test4");

const mockedVisitFlagSources = ({
  onVisit,
}: { onVisit: (_: FlagToolTypes, __: SourceFile) => void }) => {
  onVisit(FLAG_HANDLER, test1Source);
  onVisit(FLAG_SWITCHER, test1Source);
  onVisit(FLAG_RENDERER, test1Source);
  onVisit(FLAG_HANDLER, test2Source);
  onVisit(FLAG_SWITCHER, test3Source);
  onVisit(FLAG_RENDERER, test4Source);
};

describe(createGenFlagMap.name, () => {
  test("Should generate flag map", () => {
    const result = createGenFlagMap({
      traversers: {
        visitFlagSources: mockedVisitFlagSources,
      },
    } as never)("*.ts");

    const expected = {
      [test1Source.getFilePath()]: {
        source: test1Source,
        toolMap: {
          hasHandler: true,
          hasSwitcher: true,
          hasRenderer: true,
        },
      },
      [test2Source.getFilePath()]: {
        source: test2Source,
        toolMap: {
          hasHandler: true,
          hasSwitcher: false,
          hasRenderer: false,
        },
      },
      [test3Source.getFilePath()]: {
        source: test3Source,
        toolMap: {
          hasHandler: false,
          hasSwitcher: true,
          hasRenderer: false,
        },
      },
      [test4Source.getFilePath()]: {
        source: test4Source,
        toolMap: {
          hasHandler: false,
          hasSwitcher: false,
          hasRenderer: true,
        },
      },
    };

    assert.deepStrictEqual(result, expected);
  });
});
