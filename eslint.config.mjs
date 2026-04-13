import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname
});

/** @type {import('eslint').Linter.Config[]} */
export default [
    js.configs.recommended,
    {
        settings: {
            tailwindcss: {
                callees: ['classnames', 'clsx', 'twMerge'],
                config: 'tailwind.config.ts',
                cssFiles: ['**/*.css', '!**/node_modules', '!**/.*', '!**/dist', '!**/build'],
                calssAttributes: ['className', 'class'],
                cssAttributes: ['className', 'class'],
                cssFilesRefreshRate: 5_000,
                removeDuplicates: true,
                skipClassAttribute: false
            }
        }
    },
    ...compat.config({
        extends: ['plugin:@next/next/recommended'],
        parser: '@typescript-eslint/parser'
    })
];
