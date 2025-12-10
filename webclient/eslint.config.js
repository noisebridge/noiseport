const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  {
    ignores: ['build/**', 'node_modules/**'],
  },
  // Use the base react-app config without flowtype
  ...compat.config({
    extends: ['react-app/base'],
  }),
  // Override to disable flowtype rules that are incompatible with ESLint 9
  {
    rules: {
      'flowtype/define-flow-type': 'off',
      'flowtype/use-flow-type': 'off',
    },
  },
];
