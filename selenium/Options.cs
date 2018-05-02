using System;
using System.Collections.Generic;
using Pixie.Options;

namespace SeleniumTests
{
    /// <summary>
    /// A collection of options for the test runner.
    /// </summary>
    public static class Options
    {
        /// <summary>
        /// A pseudo-option for the URl to query.
        /// </summary>
        /// <value>A pseudo-option.</value>
        public static readonly Option Url =
            ValueOption.CreateStringOption(
                OptionForm.Long("url"),
                "")
            .WithDescription("Specifies the URL at which UnSHACLed is hosted.")
            .WithParameter(new SymbolicOptionParameter("uri"));

        /// <summary>
        /// The 'help' option.
        /// </summary>
        /// <returns>An option.</returns>
        public static readonly Option Help =
            FlagOption.CreateFlagOption(
                OptionForm.Short("h"),
                OptionForm.Long("help"))
            .WithDescription("Prints a help message.");

        /// <summary>
        /// The 'build-app' option, which determines if the test
        /// runner builds UnSHACLed before running the tests.
        /// </summary>
        /// <returns>An option.</returns>
        public static readonly Option BuildApplication =
            new FlagOption(
                OptionForm.Long("build-app"),
                OptionForm.Long("no-build-app"),
                false)
            .WithDescription(
                "Specifies explicitly whether the test runner " +
                "should build UnSHACLed or not. " +
                "Default behavior is to build UnSHACLed only if " +
                "no URL is specified ");

        /// <summary>
        /// A read-only list of all options accepted by the function testing
        /// program.
        /// </summary>
        public static readonly IReadOnlyList<Option> All = new Option[]
        {
            BuildApplication,
            Help
        };
    }
}

