# README

Write Function as TypeScript and check/format with Biome.

CloudFront Functions are a poor fit for ESLint + typescript-eslint:

- Single-file script, no modules, ≤10 KB — little surface for lint architecture rules
- Type safety already comes from `tsc` / `@types/aws-cloudfront-function`
- Type-aware ESLint needs a separate `tsconfig`, is slow to set up, and often fights the ES5/`sourceType: "script"` emit model
- `eslint-plugin-prettier` adds a second formatter path for little gain

For CFF TypeScript, prefer **`tsc` (correctness) + Biome (format + light lint)**.

# Prerequisites

> see [typescript](../typescript/README.md) for TypeScript prerequisites.

```sh
cd typescript-biome
npm i -D --save-exact @biomejs/biome --prefix .
npx @biomejs/biome init
```

# Biome config

`biome.json` mirrors the former Prettier style (4-space indent, no semicolons, double quotes, 120 columns) and scopes checks to `src/**/*.ts` only — not `dist/`.

Organize-imports is off: CloudFront Functions source must stay a classic script without `import`/`export`.

`handler` is the runtime entry point and looks unused to static analysis; keep a `biome-ignore` on that symbol rather than renaming it.

```sh
npm run check   # lint + format (dry)
npm run lint    # lint + format --write
npm run build   # tsc → dist/index.js
```

# TypeScript emit

TypeScript 7 removed `--target es5`, and `@types` packages are no longer auto-included. This sample uses:

- `target: es2015` — matches CloudFront Functions JavaScript runtime 2.0 (ES5.1 plus selected ES2015+ features such as `const`/`let`, `for...of`, and arrow functions)
- `types: ["aws-cloudfront-function"]` — explicit ambient types for the `handler` event shape
- no `import`/`export` and no Node builtins in source

# Goal

- TypeScript must build to CloudFront Functions compatible JavaScript.
- Generated JavaScript must remove all comments to stay under the 10 KB quota.
