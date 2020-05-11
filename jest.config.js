module.exports = {
    testURL: "http://12.0.0.1/",
    moduleDirectories: [
        "node_modules"
    ],
    collectCoverage: false,
    testRegex: "src/.*spec\\.(tsx?)$",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node",
        "html"
    ],
    modulePathIgnorePatterns: [
        "dist",
        "node_modules"
    ],
    transform: {
        "^.+\\.(js|ts|html)$": "<rootDir>/node_modules/babel-jest"
    }
}
