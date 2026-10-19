import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
export default [
  {
    ignores: [
      '.svelte-kit/**',
      '.vercel/**',
      'node_modules/**',
      'build/**',
      'playwright-report/**',
      'test-results/**',
      '.lighthouseci/**',
    ],
  },
  js.configs.recommended,
  ...svelte.configs['flat/recommended'],
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // This application is deployed at the origin root; links include locale segments.
      'svelte/no-navigation-without-resolve': 'off',
    },
  },
];
