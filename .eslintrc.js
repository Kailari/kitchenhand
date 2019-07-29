module.exports = {
  'env': {
    'commonjs': true,
    'es6': true,
    'node': true,
    'jest': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parser': '@typescript-eslint/parser',
  'plugins': [
    '@typescript-eslint'
  ],
  'parserOptions': {
    'ecmaVersion': 2018
  },
  'rules': {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        'argsIgnorePattern': '^_'
      }
    ],
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
    '@typescript-eslint/no-explicit-any': 0,
    'indent': 'off',
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
    ]
  },
  'overrides': [
    {
      'files': [
        '*.test.ts'
      ],
      'rules': {
        '@typescript-eslint/explicit-function-return-type': 0,
      }
    }
  ]
}
