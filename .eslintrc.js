module.exports = {
  'env': {
    'commonjs': true,
    'es6': true,
    'node': true,
    'jest': true
  },
  'extends': [
    'eslint:recommended',
    //'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parser': '@typescript-eslint/parser',
  'plugins': [
    '@typescript-eslint',
    'react-hooks'
  ],
  'parserOptions': {
    'ecmaVersion': 2018,
    'jsx': true,
    'useJSXTextNode': true
  },
  'rules': {
    'arrow-parens': 2,
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        'multiline': {
          'delimiter': 'comma',
          'requireLast': true
        },
        'singleline': {
          'delimiter': 'comma',
          'requireLast': false
        },
      }
    ],
    'eol-last': ['warn', 'always'],
    'no-trailing-spaces': 'warn',
    'no-multiple-empty-lines': [
      'warn',
      {
        'max': 2,
        'maxEOF': 1,
        'maxBOF': 0
      }
    ],
    "indent": "off",
    '@typescript-eslint/indent': ['error', 2],
    'no-console': 0,
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  'overrides': [
    {
      'files': [
        '*.test.ts',
        '*.tsx'
      ],
      'rules': {
        '@typescript-eslint/explicit-function-return-type': 0,
      }
    },
    {
      'files': [
        'src/models/*.ts'
      ],
      'rules': {
        '@typescript-eslint/interface-name-prefix': 0,
      }
    }
  ]
}
