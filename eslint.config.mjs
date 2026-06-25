import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

const config = [
  {
    ignores: [".next/**", "dist/**", "node_modules/**", "coverage/**", "src/supabase/client.ts"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
];

export default config;
