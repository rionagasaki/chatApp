module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended', 'prettier'],
  plugins: [],
  // add your custom rules here
  rules: {
    'vue/multi-word-component-names':'off',
    'no-unused-expressions': 'off',
    'no-sequences': 'warn',
    'import/named': 'off',
    'new-cap':'off',
    'no-dupe-keys': 'off'
  },
}
