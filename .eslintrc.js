module.exports = {
  extends: [
    'eslint-config-kentcdodds',
    'eslint-config-kentcdodds/jest',
    'eslint-config-kentcdodds/jsx-a11y',
    'eslint-config-kentcdodds/react'
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json'
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-throw-literal': 'off'
  }
}
