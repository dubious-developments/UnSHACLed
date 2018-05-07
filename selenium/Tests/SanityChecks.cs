using System.Collections.Generic;

namespace SeleniumTests.Tests
{
    /// <summary>
    /// Contains tests that are essentially just sanity checks.
    /// </summary>
    public static class SanityChecks
    {
        public static readonly TestCase CheckTitle =
            new TestCase(
                "Page title must be right",
                (driver, log) =>
                {
                    Assert.AreEqual(driver.Title, "UnSHACLed Editor");
                });

        /// <summary>
        /// A list of all sanity check tests.
        /// </summary>
        public static readonly IEnumerable<TestCase> All =
            new[]
        {
            CheckTitle
        };
    }
}
