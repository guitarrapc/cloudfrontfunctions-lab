# TypeScript Routing

Write Function as TypeScript and output as ES2015.
This example detect ip and rewrite uri, with TypeScript type definition.

# Prerequisites

> see [typescript](../typescript/README.md) for prerequisites.

Additionally add eslint.

```sh
cd typescript-eslint
npm i -D eslint --prefix .                           # add eslint
npm i -D @typescript-eslint/parser --prefix .        # add eslint for typescript
npm i -D @typescript-eslint/eslint-plugin --prefix . # add eslint for typescript
npx eslint -v                                        # confirm eslint installed.
touch tsconfig.eslint.json .eslintrc.js              # initialize eslint
```

Add eslint config `.eslintrc.js` and `tsconfig.eslint.json`.

- `.eslintrc.js`: Allow typescript eslint, ensure commonjs/es5, and ignore `dist/` from lint.

```js
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  env: {
    browser: false,
    commonjs: true,
    node: false,
  },
  parserOptions: {
    ecmaVersion: 5,
    sourceType: "script",
    project: "./tsconfig.eslint.json",
  },
  ignorePatterns: ["dist"],
  extends: ["plugin:@typescript-eslint/recommended-requiring-type-checking"],
}
```

- `tsconfig.eslint.json`: Allow js files, and enable `@typescript-eslint/no-unused-vars` rule.

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "allowJs": true
  },
  "include": ["src", ".*.js", "*.js"],
  "rules": {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"]
  }
}
```

# Write Code

## Goal

Goal of this TypeScript to JavaScript is follows.

- TypeScript must build to CloudFront Functions compatible javascript.
- Generated JavaScript must remove all commnets to reduce size below quota 10KB.
