module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/vue'
  ],
  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {
    'nuxt/no-cjs-in-config': 'off',
    'no-console': 'off',
    'require-await': 'off',
    'no-useless-escape': 'off',
    'handle-callback-err': 'off',
    'no-unused-vars': 'off',
    'prefer-const': 'off',
    'vue/no-unused-components': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/attributes-order': 'off',
    'vue/require-v-for-key': 'off',
    'vue/no-v-html': 'off',
    'vue/attribute-hyphenation': 'off',
    'node/no-deprecated-api': 'off',
    'camelcase': 'off',
    'one-var': 'off'
  }
}
