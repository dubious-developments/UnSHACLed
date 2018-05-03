using System;
using System.Collections.Generic;
using Pixie.Markup;
using Pixie.Options;

namespace SeleniumTests
{
    /// <summary>
    /// A collection of options for the test runner.
    /// </summary>
    public static class Options
    {
        /// <summary>
        /// A pseudo-option for the URL to query.
        /// </summary>
        public static readonly Option Url =
            ValueOption.CreateStringOption(
                OptionForm.Long("url"),
                "")
            .WithDescription("Specifies the URL at which UnSHACLed is hosted.")
            .WithParameter(new SymbolicOptionParameter("uri"));

        /// <summary>
        /// The 'help' option.
        /// </summary>
        public static readonly Option Help =
            FlagOption.CreateFlagOption(
                OptionForm.Short("h"),
                OptionForm.Long("help"))
            .WithDescription("Prints a help message.");

        /// <summary>
        /// The 'browsers' option, which allows users to pick
        /// the browsers they'd like to use for running the tests.
        /// </summary>
        public static readonly Option Browsers =
            SequenceOption.CreateStringOption(
                new OptionForm[]
                {
                    OptionForm.Short("b"),
                    OptionForm.Long("browsers")
                })
            .WithDescription(
                Quotation.QuoteEvenInBold(
                    "Chooses which browsers to use for running the tests. " +
                    "Permissible values are ",
                    "firefox",
                    " and ",
                    "chrome",
                    ". By default, only ",
                    "firefox",
                    " is used for running the tests."))
            .WithParameters(new SymbolicOptionParameter("browser", true));

        /// <summary>
        /// The 'build-app' option, which determines if the test
        /// runner builds UnSHACLed before running the tests.
        /// </summary>
        public static readonly Option BuildApplication =
            new FlagOption(
                OptionForm.Long("build-app"),
                OptionForm.Long("no-build-app"),
                false)
            .WithDescription(
                "Specifies explicitly whether the test runner " +
                "should build UnSHACLed or not. " +
                "Default behavior is to build UnSHACLed only if " +
                "no URL is specified.");

        /// <summary>
        /// The 'print-app-url' option, which makes the test runner
        /// print the URL to 'index.html' just prior to running the
        /// tests.
        /// </summary>
        public static readonly Option PrintApplicationUrl =
            FlagOption.CreateFlagOption(
                OptionForm.Long("print-app-url"))
            .WithCategory("Debugging")
            .WithDescription(
                Quotation.QuoteEvenInBold(
                    "Prints the URL to ",
                    "index.html",
                    " just prior to running the tests."));

        /// <summary>
        /// A read-only list of all options accepted by the function testing
        /// program.
        /// </summary>
        public static readonly IReadOnlyList<Option> All = new[]
        {
            BuildApplication,
            Browsers,
            Help,
            PrintApplicationUrl
        };
    }
}

