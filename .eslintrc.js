const { getESLintConfig } = require('@iceworks/spec');

// https://www.npmjs.com/package/@iceworks/spec
module.exports = getESLintConfig('react-ts', {
  extends: [
    "prettier"
  ],
  rules: {
    '@typescript-eslint/no-useless-constructor': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-invalid-void-type': 'off',
    '@typescript-eslint/method-signature-style': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    'prefer-const': 'warn',
    "react/jsx-uses-react": "error",
    "react/react-in-jsx-scope": "error",
    'react/no-unused-prop-types': 'warn',
    '@typescript-eslint/no-shadow': 'off',
  },
});
