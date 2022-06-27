const { getESLintConfig } = require('@iceworks/spec');

// https://www.npmjs.com/package/@iceworks/spec
module.exports = getESLintConfig('react-ts', {
  rules: {
    '@typescript-eslint/no-meaningless-void-operator': 'off',
    '@typescript-eslint/method-signature-style': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    'prefer-const': 'warn',
    'react/no-unused-prop-types': 'warn',
    '@typescript-eslint/no-shadow': 'off',
  },
});
