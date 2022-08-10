/** @type {import("@types/eslint").Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    }
  },  
  plugins: ['react', '@typescript-eslint', 'prettier'],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended", // This line was added
    "plugin:react/jsx-runtime",    
    'plugin:@typescript-eslint/eslint-recommended',
    // 'airbnb-base',
    // 'airbnb-typescript/base',
    'plugin:prettier/recommended',
    'prettier',
  ],
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: [2, 'single', { avoidEscape: true }],
    'jsx-quotes': [2, 'prefer-double'],
    semi: ['error', 'always'],
    'linebreak-style': ['error', 'unix'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'import/prefer-default-export': 0,
    // "dot-notation": 0,
    // "@typescript-eslint/dot-notation": 0,

    'prettier/prettier': 'error',
  },
  ignorePatterns: ['.prettierrc.cjs', '.eslintrc.cjs'],
};

