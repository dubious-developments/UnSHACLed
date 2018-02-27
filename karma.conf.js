module.exports = function(config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript", "detectBrowsers"],
        files: [
            { pattern: "src/**/*.ts" },
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
        singleRun: true,

        // Browser detection based on example taken from
        // https://github.com/litixsoft/karma-detect-browsers
        detectBrowsers: {
            // enable/disable, default is true
            enabled: true,

            // enable/disable phantomjs support, default is true
            usePhantomJS: true,

            // post processing of browsers list
            // here you can edit the list of browsers used by karma
            postDetection: function(availableBrowser) {
                /* Karma configuration with custom launchers
                customLaunchers: {
                    IE9: {
                    base: 'IE',
                    'x-ua-compatible': 'IE=EmulateIE9'
                    }
                }
                */

                // Add IE Emulation
                var result = availableBrowser;

                // if (availableBrowser.indexOf('IE') > -1) {
                //     result.push('IE9');
                // }

                // A list of browsers we'd rather not use if we have at least one alternative.
                // This list includes Chrome because karma-detect-browser confuses Chrome and
                // Chromium, which will cause the test suite to erroneously fail for users that
                // have only Chromium installed. This is related to
                // https://github.com/litixsoft/karma-detect-browsers/issues/22
                //
                // During CI builds, we'll just make sure Chrome's actually installed if
                // karma-detect-browser advertises it. We'll also test using PhantomJS just
                // because we can.
                let undesirables = process.env.CI ? [] : ['PhantomJS', 'Chrome'];

                // Remove undesirables if another browser has been detected.
                for (let i = 0; i < undesirables.length; i++) {
                    if (availableBrowser.length > 1 && availableBrowser.indexOf(undesirables[i]) > -1) {
                        var j = result.indexOf(undesirables[i]);
    
                        if (j !== -1) {
                            result.splice(j, 1);
                        }
                    }
                }

                return result;
            }
        }
    });
};
