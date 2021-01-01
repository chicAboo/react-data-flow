// http://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module', // 类型为module，因为代码使用了使用了ECMAScript模块
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true, // 预定义的全局变量，这里是浏览器环境
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', 'react-hooks', 'prettier'],
  globals: {
    // 以下变量已在webpack中提供
    __PROD__: 'readonly',
    React: 'readonly',
    ReactDOM: 'readonly',
    Redux: 'readonly',
    ReduxThunk: 'readonly',
    ReactRouterDOM: 'readonly',
    cls: 'readonly',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    semi: ['error', 'always'],
    quotes: [1, 'single'],
    'react/prop-types': [0],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prefer-promise-reject-errors': [0],
    'react/jsx-fragments': [0],
    'react/display-name': [0], // 允许匿名类
    'standard/no-callback-literal': [0], // 允许在callback中使用所有类型参数
    'react/jsx-no-undef': [2, { allowGlobals: true }], // 允许从global scope中查找全局组件定义，jsx文件不需要引用React、ReactDom等
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-function': [0],
    '@typescript-eslint/no-explicit-any': [0],
    '@typescript-eslint/no-var-requires': [0],
    '@typescript-eslint/no-unused-vars': [0],
    'react/no-unknown-property': [0],
  },
};
