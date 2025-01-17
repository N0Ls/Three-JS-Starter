import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules : {
      "linebreak-style": [
        "error",
        "unix",
        ],
      "quotes": [
        "warn",
        "double",
        ],
      "semi": [
        "error",
        "always",
        ],
      "comma-dangle": [ "error", "always-multiline" ],
    },
  },
];