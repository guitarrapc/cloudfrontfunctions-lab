# README

Write Function as TypeScript and output as ES2015.
This example offers unit test.

# Prerequisites

> see [typescript](../typescript/README.md) for prerequisites.

add babel rewire and jest.

```sh
cd typescript-unittest
npm i -D babel-plugin-rewire babel-jest --prefix .
touch .babelrc.js
```

add content to `.babelrc.js`.

```js
module.exports = {
  plugins: ['babel-plugin-rewire'],
};
```

add `"test": "tsc; echo 'handler' >> ./dist/index.js; npx jest; tsc;"` to `package.json`. See next secrtion for detail explanation.

# UnitTest

There are 2 concerns to write unit test for CloudFront Function.

1. Unit Test runs to `dist/index.js`, not `src/index.ts`.
2. Babel rewire require `handler` on last line of `dist/index.js`.

Following step is how to run test, yes, it is what I put `test` for `package.json`.

```sh
npm run build                     # build latest
echo "handler` >> ./dist/index.js # add handler for test
npx jest                          # run unit test
npm run build                     # remove handler
```

Prepare `dist/index.tets.js` unit test file.

```js
const originRequest = require('./index')
const sut = originRequest.__get__('handler');
test('it does rewrite url case 1', async () => {

    // given
    const event = {
        request: {
            method: 'GET',
            uri: '/?code=123'
        }
    }

    // when
    const uri = sut(event).uri

    // then
    expect(uri).toBe('/index.html?code=123');
})
```

Now you are ready to test, run `npm run test`.

```sh
$ npm run test --if-present

> test
> tsc; echo 'handler' >> ./dist/index.js; npx jest

 PASS  dist/index.test.js
  ✓ it does rewrite url case 1 (2 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.94 s
Ran all test suites.
```
