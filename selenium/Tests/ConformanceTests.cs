using System.Collections.Generic;
using OpenQA.Selenium;
using System;
using System.Windows.Forms;
using static System.Diagnostics.Stopwatch;
using static System.Threading.Thread;
using System.Diagnostics;

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
                   driver.OpenSHACLFile("demo_shacl.ttl");
                   Sleep(1000);
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
                   driver.OpenSHACLFile("demo_shacl.ttl");
                   Sleep(1000);
                   IReadOnlyCollection<IWebElement> elements = driver.FindElements(By.XPath("//*[@fill='#c10000']"), 10);
                   Assert.IsTrue(elements.Count == 1);
               });

        public static readonly TestCase CheckTimeForConformanceError =
            new TestCase(
               "Check that the time for the header turning red is less than 1000ms",
               (driver, log) =>
               {
                   driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
                   //Log in
                   driver.ByPassLogin();
                   Sleep(100);
                   //Open data file
                   Stopwatch stopwatch = new Stopwatch();
                   driver.OpenDataFile("demo_data_non-conforming.ttl");
                   var header = driver.FindElement(By.XPath("//*[@fill='#a1e44d']"), 10);
                   driver.OpenSHACLFile("demo_shacl.ttl");
                   stopwatch.Start();
                   Sleep(200);
                   IReadOnlyCollection<IWebElement> elements = driver.FindElements(By.XPath("//*[@fill='#c10000']"));
                   while(elements.Count == 0)
                   {
                       elements = driver.FindElements(By.XPath("//*[@fill='#c10000']"));
                   }
                   stopwatch.Stop();
                   long time = stopwatch.ElapsedMilliseconds;
                   Assert.IsTrue(elements.Count == 1);
                   Assert.IsTrue(time < 1000);
               });


        public static readonly TestCase CheckReportConforming =
            new TestCase(
               "No errors are reported when the data is conforming",
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
                   var conformanceButton = driver.FindElement(By.Id("conformance"));
                   conformanceButton.Click();
                   Sleep(200);
                   var conformanceReport = driver.FindElement(By.XPath("/html/body/div[2]/div/label"),10);
                   Assert.IsTrue(conformanceReport.Text.Equals("No conformance errors"));


               });

        public static readonly TestCase CheckReportNotConforming =
            new TestCase(
               "Errors are reported when data is not conforming",
               (driver, log) =>
               {
                   driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
                   //Log in
                   driver.ByPassLogin();
                   Sleep(100);
                   //Open data file
                   driver.OpenDataFile("demo_data_non-conforming.ttl");
                   driver.OpenSHACLFile("demo_shacl.ttl");
                   Sleep(200);
                   var conformanceButton = driver.FindElement(By.Id("conformance"));
                   conformanceButton.Click();
                   Sleep(200);
                   var conformanceReport = driver.FindElement(By.XPath("//*[contains(text(),'The data value')]"), 10);
                   Assert.IsTrue(conformanceReport.Text.Contains("The data value: http://example.com/ns#Bob,"));
               });



        public static readonly ICollection<TestCase> All =
               new[]
                    {
                        CheckGreenWhenConforming,
                        CheckRedWhenNotConforming,
                        CheckTimeForConformanceError,
                        CheckReportConforming,
                        CheckReportNotConforming
                    };

}
}
