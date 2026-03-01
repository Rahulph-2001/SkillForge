import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    // Ignore build output and config files (they don't need to be linted)
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            '*.config.js',
            '*.config.ts',
            '*.config.d.ts',
            '*.config.mjs',
            'vite.config.js.timestamp-*.mjs',
        ],
    },

    // Base JS + TypeScript linting for all TS/TSX source files
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.recommendedTypeChecked,
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            // ── React Hooks ───────────────────────────────────────────────────
            // v5 flat config: use the new recommended flat config
            ...reactHooks.configs['recommended-latest'].rules,

            // React Refresh (HMR): warn when non-component exports are found
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],

            // ── TypeScript ────────────────────────────────────────────────────

            // Treat `any` as a warning (some third-party libs require it temporarily)
            '@typescript-eslint/no-explicit-any': 'warn',

            // Unused vars: ignore underscore-prefixed variables/args (common convention)
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],

            // Floating promises must be handled — prevents silent async failures
            '@typescript-eslint/no-floating-promises': 'error',

            // Consistent type-only imports — better tree-shaking and bundle clarity
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
            ],

            // Forbid misuse of promises in event handlers and callbacks
            '@typescript-eslint/no-misused-promises': [
                'error',
                { checksVoidReturn: { attributes: false } },
            ],

            // Allow non-null assertions sparingly (warn instead of error)
            '@typescript-eslint/no-non-null-assertion': 'warn',

            // Unsafe any patterns (warn to catch accidental typing errors)
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/no-unsafe-call': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'warn',
            '@typescript-eslint/no-unsafe-return': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
        },
    },

    // Override for API Services Layer
    // The services layer (Axios) inherently deals with dynamically typed payloads from the backend.
    // Instead of forcing hundreds of manual DTO interfaces, we disable `any` warnings strictly at this boundary,
    // ensuring the rest of the app (Redux, hooks, components) remains strictly typed.
    {
        files: ['src/services/**/*.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
        },
    }
);
