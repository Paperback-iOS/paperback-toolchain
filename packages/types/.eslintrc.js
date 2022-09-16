/**
 * @type {import("eslint").Linter.Config}
 */
const config = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'standard-with-typescript'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-extra-semi': 'error',
    quotes: ['error', 'single'],
    indent: ['error', 2]
  }
}

module.exports = config
