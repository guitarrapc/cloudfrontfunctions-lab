const fs = require("node:fs")
const vm = require("node:vm")

/**
 * Load a CloudFront Functions script and return its top-level `handler`.
 * CFF sources cannot use module.exports / export, so Node cannot require() them.
 */
function loadHandler(filePath) {
    const code = fs.readFileSync(filePath, "utf8")
    const context = vm.createContext(Object.create(null))
    vm.runInContext(code, context, { filename: filePath })

    if (typeof context.handler !== "function") {
        throw new Error(`handler not found in ${filePath}`)
    }

    return context.handler
}

module.exports = { loadHandler }
