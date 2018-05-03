using System;
using OpenQA.Selenium;
using Pixie;
using Pixie.Markup;

namespace SeleniumTests
{
    /// <summary>
    /// Provides tools that can be used to write tests.
    /// </summary>
    public static class Assert
    {
        /// <summary>
        /// Asserts that a condition holds true.
        /// </summary>
        /// <param name="condition">
        /// A value that must always be true.
        /// </param>
        /// <param name="message">
        /// The message to log if the condition is not satisfied.
        /// </param>
        public static void IsTrue(bool condition, MarkupNode message)
        {
            TestCase.AssertIsTrue(condition, message);
        }

        /// <summary>
        /// Asserts that a condition holds true.
        /// </summary>
        /// <param name="condition">
        /// A value that must always be true.
        /// </param>
        public static void IsTrue(bool condition)
        {
            IsTrue(condition, "condition was false.");
        }

        /// <summary>
        /// Asserts that a condition does not hold true.
        /// </summary>
        /// <param name="condition">
        /// A value that must never be true.
        /// </param>
        /// <param name="message">
        /// The message to log if the condition is not satisfied.
        /// </param>
        public static void IsFalse(bool condition, MarkupNode message)
        {
            IsTrue(!condition, message);
        }

        /// <summary>
        /// Asserts that a condition does not hold true.
        /// </summary>
        /// <param name="condition">
        /// A value that must never be true.
        /// </param>
        public static void IsFalse(bool condition)
        {
            IsFalse(condition, "condition was true.");
        }

        /// <summary>
        /// Asserts that a value cannot be <c>null</c>.
        /// </summary>
        /// <param name="value">The value to check.</param>
        /// <param name="valueName">The name of the value to check.</param>
        public static void IsNotNull(object value, string valueName)
        {
            IsTrue(
                value != null,
                Quotation.QuoteEvenInBold(
                    "expected a non-",
                    "null",
                    " value for ",
                    valueName,
                    ", but got ",
                    "null",
                    " anyway."));
        }

        /// <summary>
        /// Asserts that two values are equal.
        /// </summary>
        /// <param name="actual">The left-hand side of the equality.</param>
        /// <param name="expected">The right-hand side of the equality.</param>
        /// <param name="message">
        /// The message to log if the objects are not equal.
        /// </param>
        public static void AreEqual(
            object actual,
            object expected,
            MarkupNode message)
        {
            IsTrue(object.Equals(actual, expected), message);
        }

        /// <summary>
        /// Asserts that two values are equal.
        /// </summary>
        /// <param name="actual">The left-hand side of the equality.</param>
        /// <param name="expected">The right-hand side of the equality.</param>
        public static void AreEqual(
            object actual,
            object expected)
        {
            AreEqual(
                actual,
                expected,
                Quotation.QuoteEvenInBold(
                    "values are not equal; expected ",
                    expected.ToString(),
                    " but got ",
                    actual.ToString(),
                    "."));
        }

        /// <summary>
        /// Asserts that two values are not equal.
        /// </summary>
        /// <param name="actual">The left-hand side of the equality.</param>
        /// <param name="expected">The right-hand side of the equality.</param>
        /// <param name="message">
        /// The message to log if the objects are equal.
        /// </param>
        public static void AreNotEqual(
            object actual,
            object expected,
            MarkupNode message)
        {
            IsFalse(object.Equals(actual, expected), message);
        }

        /// <summary>
        /// Asserts that two values are not equal.
        /// </summary>
        /// <param name="actual">The left-hand side of the equality.</param>
        /// <param name="expected">The right-hand side of the equality.</param>
        public static void AreNotEqual(
            object actual,
            object expected)
        {
            AreNotEqual(
                actual,
                expected,
                Quotation.QuoteEvenInBold(
                    "values are equal; expected anything but ",
                    expected.ToString(),
                    " but got it anyway (",
                    actual.ToString(),
                    ")."));
        }
    }
}
