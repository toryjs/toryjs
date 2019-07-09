module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  plugins: ['react-hooks'],
  extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-object-literal-type-assertion': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  },
  settings: {
    react: {
      version: 'detect' // Tells eslint-plugin-react to automatically detect the version of React to use
    }
  }
};
