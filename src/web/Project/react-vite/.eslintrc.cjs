/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'react-hooks', 'react-refresh'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
  rules: {
    // Vite + React refresh safety
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

    // This repo intentionally uses `any` in a few interop boundaries (OCR, migrations, etc.)
    '@typescript-eslint/no-explicit-any': 'off',

    // Keep lint deterministic with --max-warnings 0 (don't fail builds on hook deps heuristics)
    'react-hooks/exhaustive-deps': 'off',

    // Allow regex escapes as-written (avoid churn)
    'no-useless-escape': 'off',

    // Avoid const churn in large calc tables
    'prefer-const': 'off'
  },
  ignorePatterns: ['dist/', 'node_modules/', 'coverage/']
};


