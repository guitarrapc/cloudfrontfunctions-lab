# TypeScript

Write Function as TypeScript and output as ES2015.

# Prerequisites

```sh
cd typescript
npm init
npm i -D typescript --prefix .
npx tsc --init
npm i -D @types/aws-cloudfront-function --prefix .
npm run build
```

Edit tsconfig.json and set compilerOptions `"removeComments": false` to remove all comments from generated js.

# Write Code

## Goal

Goal of TypeScript to Javascript is follows.

- TypeScript must build to CloudFront Functions compatible javascript.
- Generated Javascript must remove all commnets to reduce size below quota 10KB.

Let's use original as follows.

https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/example-function-add-index.html

```js
function handler(event) {
  var request = event.request
  var uri = request.uri

  // Check whether the URI is missing a file name.
  if (uri.endsWith('/')) {
    request.uri += 'index.html'
  }
  // Check whether the URI is missing a file extension.
  else if (!uri.includes('.')) {
    request.uri += '/index.html'
  }

  return request
}
```

## Write and build

Write Function as TypeScript in `src/`. Type hint is provided by `@types/aws-cloudfront-function`.

```ts
function handler(event: AWSCloudFrontFunction.Event): AWSCloudFrontFunction.Request {
  const { request } = event
  const uri = request.uri

  // Check whether the URI is missing a file name.
  if (uri.endsWith('/')) {
    request.uri += 'index.html'
    // Check whether the URI is missing a file extension.
  } else if (!uri.includes('.')) {
    request.uri += '/index.html'
  }

  return request
}
```

build typeScript by `npm run build`, and generates es5 compatible javascript.

> **Note** VSCode User can build with `Ctrl + Shift + b` -> `tsc: build`

```js
function handler(event) {
  var request = event.request
  var uri = request.uri
  if (uri.endsWith('/')) {
    request.uri += 'index.html'
  } else if (!uri.includes('.')) {
    request.uri += '/index.html'
  }
  return request
}
```
