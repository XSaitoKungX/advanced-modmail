import { defineConfig, globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";

// Layer dependency rules from ARCHITECTURE.md. `noExternal` also forbids npm
// packages (Node builtins stay allowed); it exists for the framework-free
// domain layer. Relative imports that escape `src/<layer>` are only permitted
// toward layers listed in `allowed`.
const layers = [
  { name: "domain", allowed: [], noExternal: true },
  { name: "application", allowed: ["domain"] },
  { name: "infrastructure", allowed: ["domain", "application"] },
  { name: "transport", allowed: ["domain", "application"] },
  { name: "presentation", allowed: ["domain", "application"] },
];

const layerBoundaryConfigs = layers.map(({ name, allowed, noExternal }) => {
  const patterns = [];
  if (allowed.length === 0) {
    patterns.push({
      regex: "^\\.\\.(?:/|$)",
      message: `${name} must not import from other layers.`,
    });
  } else {
    patterns.push({
      regex: `^(?:\\.\\./)+(?!(?:${allowed.join("|")})(?:/|$))`,
      message: `${name} may only depend on: ${allowed.join(", ")}.`,
    });
  }
  if (noExternal) {
    patterns.push({
      regex: "^(?!\\.|node:)",
      message: `${name} must not depend on npm packages.`,
    });
  }
  return {
    files: [`src/${name}/**/*.ts`],
    ignores: [`src/${name}/**/*.test.ts`],
    rules: { "no-restricted-imports": ["error", { patterns }] },
  };
});

export default defineConfig(
  globalIgnores(["dist/**", "coverage/**", ".pnpm-store/**"]),
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["**/*.{ts,mts,cts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  ...layerBoundaryConfigs,
  prettierConfig,
);
