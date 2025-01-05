import type { Project } from "ts-morph";
import { createGetHandlerFlags } from "./get-handler-flag";
import { createGetRendererFlags } from "./get-renderer-flag";
import { createGetSwitcherFlags } from "./get-switcher-flag";
import { createVisitFlagSources } from "./visit-flag-sources";

export const createTraversers = (project: Project) => ({
  getHandlerFlags: createGetHandlerFlags(project),
  getSwitcherFlags: createGetSwitcherFlags(project),
  getRendererFlags: createGetRendererFlags(project),
  visitFlagSources: createVisitFlagSources(project),
});
