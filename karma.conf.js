module.exports = function(config) { 
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            { pattern: "source/**/*.ts" },
            { pattern: "test/**/*.ts" }
        ],
    preprocessors: {
        "**/*.ts": ["karma-typescript"]
    },
    karmaTypescriptConfig: {
        reports:
        {
        "lcovonly": {
            "directory": "coverage",
            "filename": "lcov.info",
            "subdirectory": "lcov"
        }
        }
    },
    reporters: ["coverage", "dots", "karma-typescript"],
    browsers: ["Firefox"],
    singleRun: true });
};
