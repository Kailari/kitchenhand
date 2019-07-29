module.exports = {
  'settings': {
    'react': {
      'version': 'detect'
    }
  },
  'extends': [
    'plugin:react/recommended',
    '../../.eslintrc.js'
  ],
  'env': {
    'browser': true,
  },
  'plugins': [
    'react-hooks'
  ],
  'parserOptions': {
    'jsx': true,
    'useJSXTextNode': true
  },
  'rules': {
    'react/prop-types': 0,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  'overrides': [
    {
      'files': [
        '*.tsx'
      ],
      'rules': {
        '@typescript-eslint/explicit-function-return-type': 0,
      }
    }
  ]
}
