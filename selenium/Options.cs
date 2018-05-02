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
        /// A pseudo-option for the URI to query. 
        /// </summary>
        /// <value>A pseudo-option.</value>
        public static readonly Option Uri =
            ValueOption.CreateStringOption(
                OptionForm.Long("uri"),
                "")
            .WithDescription("Specifies the URI at which UnSHACLed is hosted.")
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
        /// A read-only list of all options accepted by the function testing
        /// program.
        /// </summary>
        public static readonly IReadOnlyList<Option> All = new Option[]
        {
            Help
        };
    }
}

