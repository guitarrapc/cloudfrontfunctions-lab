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
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended-requiring-type-checking"],
}
