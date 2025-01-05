import packageJson from "../../package.json" assert { type: "json" };

export const LIBRARY_NAME = `${packageJson.name}/core`;

export const FLAG_RENDERER = "FlagRenderer";
export const FLAG_SWITCHER = "flagSwitcher";
export const FLAG_HANDLER = "flagHandler";
