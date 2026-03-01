const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const globals = require("globals");

module.exports = tseslint.config(
    {
        ignores: ["dist", "node_modules", "prisma", "scripts", "*.js", "*.cjs", "*.mjs"],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": ["warn", {
                "argsIgnorePattern": "^_"
            }],
            "no-console": "off",
        }
    }
);
