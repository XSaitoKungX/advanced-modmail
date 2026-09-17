import { defineConfig, globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";

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
    // Environment variables are deployment configuration: they must be read
    // and validated in one place instead of scattered through feature code.
    files: ["index.ts", "src/**/*.ts"],
    ignores: ["src/config/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "MemberExpression[object.name='process'][property.name='env']",
          message:
            "Read environment variables through src/config/ instead of process.env.",
        },
      ],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  prettierConfig,
);
