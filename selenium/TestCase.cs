using System;
using System.IO;
using OpenQA.Selenium;
using Pixie;
using Pixie.Markup;
using Pixie.Terminal;
using Pixie.Terminal.Devices;

namespace SeleniumTests
{
    /// <summary>
    /// Describes a test case that can be run against a web driver.
    /// </summary>
    public sealed class TestCase
    {
        /// <summary>
        /// Creates a new test case.
        /// </summary>
        /// <param name="description">A description for the test case.</param>
        /// <param name="implementation">
        /// The test case's implementation: a function that can be run against a web driver.
        /// </param>
        public TestCase(
            string description,
            Action<IWebDriver, ILog> implementation)
        {
            this.Description = description;
            this.impl = implementation;
        }

        /// <summary>
        /// Gets the test case's description.
        /// </summary>
        /// <returns>The description.</returns>
        public string Description { get; private set; }

        private Action<IWebDriver, ILog> impl;

        /// <summary>
        /// Runs this test case against a web driver.
        /// </summary>
        /// <param name="driver">A web driver to use.</param>
        /// <param name="log">A log to send messages to.</param>
        /// <returns>
        /// <c>true</c> if the test was successful; otherwise, <c>false</c>.
        /// </returns>
        public bool Run(IWebDriver driver, ILog log)
        {
            try
            {
                impl(driver, log);
                return true;
            }
            catch (TestFailedException ex)
            {
                log.Log(
                    new Pixie.LogEntry(
                        Severity.Error,
                        new Diagnostic(
                            new Quotation(Description, 2),
                            "error",
                            Colors.Red,
                            "assertion failed",
                            ex.FormattedMessage)));
                return false;
            }
        }

        /// <summary>
        /// Asserts that a condition holds true.
        /// </summary>
        /// <param name="condition">
        /// A value that must always be true.
        /// </param>
        /// <param name="message">
        /// The message to log if the condition is not satisfied.
        /// </param>
        public static void AssertIsTrue(bool condition, MarkupNode message)
        {
            if (!condition)
            {
                throw new TestFailedException(message);
            }
        }

        /// <summary>
        /// The type of exception that is thrown when a test fails.
        /// </summary>
        private sealed class TestFailedException : Exception
        {
            public TestFailedException(MarkupNode formattedMessage)
                : base(AsPlainText(formattedMessage))
            {
                this.FormattedMessage = formattedMessage;
            }

            public TestFailedException(MarkupNode formattedMessage, Exception inner)
                : base(AsPlainText(formattedMessage), inner)
            {
                this.FormattedMessage = formattedMessage;
            }

            /// <summary>
            /// A formatted version of this exception's message.
            /// </summary>
            /// <returns>A formatted message.</returns>
            public MarkupNode FormattedMessage { get; private set; }

            private static string AsPlainText(MarkupNode node)
            {
                var writer = new StringWriter();
                var term = new TextWriterTerminal(writer, 80, NoStyleManager.Instance);
                var log = new TerminalLog(term);
                log.Log(node);
                return writer.GetStringBuilder().ToString();
            }
        }
    }
}
