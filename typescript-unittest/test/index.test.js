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
