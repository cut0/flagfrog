# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Testing
- `pnpm build` - Build both core library and CLI using TypeScript and esbuild
- `pnpm test` - Run tests using Node.js native test runner with tsx
- `pnpm typecheck` - Type check using tsgo (TypeScript Native Preview)
- `pnpm lint:check` - Check code style with Biome
- `pnpm lint:fix` - Fix code style issues with Biome

### CLI Development
- `pnpm cli:dev` - Run CLI in development mode using tsx
- `pnpm cli:prd` - Run CLI in production mode from built dist

### Single Test Execution
- `node --import tsx --test path/to/specific.test.ts` - Run a single test file

## Architecture Overview

FlagFrog is a feature flag management library with both a runtime API and a CLI tool for flag removal.

### Core Structure
- **Core Library** (`src/core/`): Runtime API for feature flags
  - `Handler.ts` - Conditional execution based on flag state
  - `Switcher.ts` - Value switching based on flag state  
  - `Renderer.tsx` - React component for conditional rendering
- **CLI Tool** (`src/cli/`): AST-based flag management and removal
  - Uses ts-morph for TypeScript AST manipulation
  - Commands: `list` (find flag usage) and `remove` (remove flags from code)

### Key Patterns
- **AST Context**: The CLI creates a shared AST context using ts-morph Project for all file operations
- **Use Cases Layer**: Business logic is separated into `src/cli/usecases/` 
- **Migrators**: AST transformations in `src/cli/ast/migrators/` handle code removal
- **Traversers**: AST traversal utilities in `src/cli/ast/traversers/` find flag usage

### Build System
- Uses custom esbuild configuration in `build.ts`
- Builds both ESM and CJS formats for the core library
- CLI is built as a standalone executable with shebang

### CLI Usage Patterns
The CLI operates on glob patterns and uses ts-morph to:
1. Parse TypeScript/JSX files into ASTs
2. Find flag usages via traversers
3. Apply transformations via migrators to remove flags
4. Write modified code back to files

Example flag patterns the CLI handles:
- `flagHandler({ name: "FlagName", value: true/false, on: ..., off: ... })`
- `flagSwitcher({ name: "FlagName", value: true/false, on: ..., off: ... })`
- `<FlagRenderer name="FlagName" value={true/false} on={...} off={...} />`