import globals from 'globals';
import js from '@eslint/js';

export default [
  {
    ignores: ['dist/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2024,
      globals: {
        ...globals.node,
        fetch: 'readonly',
        URL: 'readonly',
      },
      parserOptions: {
        sourceType: 'module',
      },
    },
  },
];
