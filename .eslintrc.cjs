/** @type {import('eslint').Linter.Config} */
module.exports = {
  "extends": ["next/core-web-vitals"],
  "ignorePatterns": ["node_modules", "dist"],
  "parserOptions": {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
  "rules": {
    "react/no-unescaped-entities": "off",
  }
};