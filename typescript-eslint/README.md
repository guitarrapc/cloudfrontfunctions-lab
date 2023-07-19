# TypeScript Routing

Write Function as TypeScript and output as ES2015.
This example detect ip and rewrite uri, with TypeScript type definition.

# Prerequisites

> see [typescript](../typescript/README.md) for prerequisites.

Additionally add eslint.

```sh
cd typescript-eslint
npm i -D eslint --prefix .                                                     # add eslint
npm i -D @typescript-eslint/parser @typescript-eslint/eslint-plugin --prefix . # add eslint for typescript
npx eslint -v                                                                  # confirm eslint installed.
npm i -D eslint-config-prettier eslint-plugin-prettier --prefix .              # add eslint prettier to disable eslint rules that conflict with prettier
touch tsconfig.eslint.json .eslintrc.yaml                                      # initialize eslint
```

Add eslint config `.eslintrc.yaml` and `tsconfig.eslint.json`.

- `.eslintrc.yaml`: Allow typescript eslint, ensure commonjs/es5, and ignore `dist/` from lint.

> `.exlintrc.yaml` is not only option, you can use `.eslintrc.json` or `.eslintrc.js`. However `.eslintrc.yaml` is easy to write and can ignore from prettier.

```yaml
root: true
parser: "@typescript-eslint/parser"
plugins:
  - "@typescript-eslint"
env:
  browser: false
  commonjs: true
  node: false
parserOptions:
  ecmaVersion: 5
  sourceType: "script"
  project: "./tsconfig.eslint.json"
ignorePatterns:
  - "dist"
extends:
  - "eslint:recommended"
  - "plugin:@typescript-eslint/recommended-requiring-type-checking"
  - "prettier" # add prettier plugin at the end to ignore all eslint format rules
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

# Enable prettier on eslint

When workspace contains not only JavaScript, set prettier as default formmaer is not acceptable. Running prettier with ESLint might fit in these situation.

* Remove VSCode extension `esbenp.prettier-vscode`.
* Remove VSCode settings `"editor.defaultFormatter": "esbenp.prettier-vscode"`.
* Install `eslint-plugin-prettier` and `prettier` npm package to configure running pretter in ESLint.

```sh
npm i -D eslint-config-prettier eslint-plugin-prettier --prefix . # add eslint prettier to disable eslint rules that conflict with prettier
npm i -D prettier --prefix .                                      # add prettier to format code on eslint
```

`.eslintrc.yaml`: add `plugin:prettier/recommended` into extend

```yaml
root: true
parser: "@typescript-eslint/parser"
plugins:
  - "@typescript-eslint"
env:
  browser: false
  commonjs: true
  node: false
parserOptions:
  ecmaVersion: 5
  sourceType: "script"
  project: "./tsconfig.eslint.json"
ignorePatterns:
  - "dist"
extends:
  - "eslint:recommended"
  - "plugin:@typescript-eslint/recommended-requiring-type-checking"
  - "prettier"
  - "plugin:prettier/recommended" # <-- add this!!!!
```

## Goal

Goal of this TypeScript to JavaScript is follows.

- TypeScript must build to CloudFront Functions compatible javascript.
- Generated JavaScript must remove all commnets to reduce size below quota 10KB.
