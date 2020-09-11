module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:nuxt/recommended'
  ],
  "parserOptions": {
    "parser": "babel-eslint",
    "sourceType": "module"
  },
  rules: {
    "vue/require-default-prop": "off",
    "no-shadow": "off",
    "no-param-reassign": "off",
    "indent": "off",
    "vue/html-indent": "off",
    "space-before-function-paren": "off",
    "quotes": "off",
    "comma-dangle": "off",
    "no-unused-vars": "off",
    "no-console": "off",
    "arrow-parens": "off",
    "dot-notation": "off",
    "no-trailing-spaces": "off",
    "vue/multiline-html-element-content-newline": "off",
    "semi": [2, "always"]
  }
}
