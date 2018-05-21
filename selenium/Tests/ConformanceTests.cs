using System.Collections.Generic;
using OpenQA.Selenium;
using System;
using System.Windows.Forms;
using static System.Diagnostics.Stopwatch;
using static System.Threading.Thread;

namespace SeleniumTests.Tests
{
    public static class ConformanceTests
    {
        public static readonly TestCase CheckGreenWhenConforming =
            new TestCase(
               "Header remains green when there are no conformance errors",
               (driver, log) =>
               {
                   driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
                   //Log in
                   driver.ByPassLogin();
                   Sleep(100);
                   //Open data file
                   driver.OpenDataFile("demo_data_conforming.ttl");
                   var header = driver.FindElement(By.XPath("//*[@fill='#a1e44d']"), 10);
                   driver.OpenSHACLFile("demo_shacl.ttl");
                   Sleep(200);
                   IReadOnlyCollection<IWebElement> elements = driver.FindElements(By.XPath("//*[@fill='#a1e44d']"), 10);
                   Assert.IsTrue(elements.Count == 2);
               });

        public static readonly TestCase CheckRedWhenNotConforming =
            new TestCase(
               "Header turns red when there are conformance erros",
               (driver, log) =>
               {
                   driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
                   //Log in
                   driver.ByPassLogin();
                   Sleep(100);
                   //Open data file
                   driver.OpenDataFile("demo_data_non-conforming.ttl");
                   var header = driver.FindElement(By.XPath("//*[@fill='#a1e44d']"), 10);
                   driver.OpenSHACLFile("demo_shacl.ttl");
                   //var conformanceButton = driver.FindElement(By.Id("conformance"));
                   //conformanceButton.Click();
                   Sleep(200);
                   IReadOnlyCollection<IWebElement> elements = driver.FindElements(By.XPath("//*[@fill='#c10000']"), 10);
                   Assert.IsTrue(elements.Count == 1);
               });

                public static readonly ICollection<TestCase> All =
               new[]
                    {
                        CheckGreenWhenConforming,
                        CheckRedWhenNotConforming
                    };

}
}
