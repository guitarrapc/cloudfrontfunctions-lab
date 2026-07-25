# README

Write Function as TypeScript and unit-test the built CloudFront Functions script with Node's built-in test runner.

# Prerequisites

> see [typescript](../typescript/README.md) for prerequisites.

No Babel, Jest, or rewire. Tests load `dist/index.js` through `node:vm` because CloudFront Functions cannot use `export` / `module.exports`.

# Unit test

There is one concern when unit-testing a CloudFront Function locally:

1. Tests should run against **`dist/index.js`** (the deployable artifact), not only the TypeScript source.

`test/load-handler.js` evaluates that file in a VM context and returns the top-level `handler` binding.

```sh
npm run build   # tsc → dist/index.js
npm test        # build, then node --test
```

`test/index.test.js`:

```js
const { describe, it } = require("node:test")
const assert = require("node:assert/strict")
const path = require("node:path")
const { loadHandler } = require("./load-handler")

const sut = loadHandler(path.join(__dirname, "..", "dist", "index.js"))

describe("handler", () => {
    it("rewrites /?query to /index.html?query", () => {
        const event = {
            request: {
                method: "GET",
                uri: "/?code=123",
            },
        }

        const result = sut(event)

        assert.equal(result.uri, "/index.html?code=123")
    })
})
```

# Goal

- TypeScript must build to CloudFront Functions compatible JavaScript.
- Generated JavaScript must remove all comments to stay under the 10 KB quota.
- Unit tests must exercise the same bare `function handler` that CloudFront runs.
