import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Seed and test files
    "seed.js",
    "seed_direct.js",
    "test_db_common.js",
    "test_db.ts",
    "test_output.txt",
    "test.log",
    "output.txt",
  ]),
]);

export default eslintConfig;
