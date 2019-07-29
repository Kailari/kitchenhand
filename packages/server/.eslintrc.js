module.exports = {
  'extends': [
    '../../.eslintrc.js'
  ],
  'overrides': [
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
