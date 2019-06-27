module.exports = {
  'env': {
    'commonjs': true,
    'es6': true,
    'node': true,
    'jest': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
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
