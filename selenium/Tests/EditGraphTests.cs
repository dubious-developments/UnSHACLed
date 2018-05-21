using System.Collections.Generic;
using OpenQA.Selenium;
using System;
using System.Windows.Forms;
using static System.Diagnostics.Stopwatch;

namespace SeleniumTests.Tests
{
    public static class EditGraphTests
    {
        public static readonly TestCase DeleteSHACLShape =
           new TestCase(
               "SHACL shapes can be deleted",
               (driver, log) =>
               {
                   driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
                    //Log in
                    driver.ByPassLogin();
                    //Open a SHACL file
                    driver.OpenSHACLFile("demo_shacl.ttl");
                   IWebElement shaclElement = driver.FindElement(By.XPath("//*[contains(text(),'PersonShape')]"), 10);
                   String shaclElementID = shaclElement.GetAttribute("id");
                   shaclElement.Click();
                   SendKeys.SendWait("{DEL}");
                   System.Threading.Thread.Sleep(500);
                   try
                   {
                       
                       IReadOnlyCollection<IWebElement> elements = driver.FindElements(By.Id(shaclElementID));
                       Assert.IsTrue(elements.Count == 0);
                   }
                   catch (StaleElementReferenceException) {
                       Assert.IsTrue(true);
                   }
               });

        public static readonly TestCase DeleteDataShape =
           new TestCase(
               "Data shapes can be deleted",
               (driver, log) =>
               {
                   driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
                   //Log in
                   driver.ByPassLogin();
                   //Open a SHACL file
                   driver.OpenDataFile("demo_data_conforming.ttl");
                   var dataElement = driver.FindElement(By.XPath("//*[contains(text(),'Alice')]"), 10);
                   String elementID = dataElement.GetAttribute("id");
                   dataElement.Click();
                   SendKeys.SendWait("{DEL}");
                   System.Threading.Thread.Sleep(500);
                   try
                   {
                       IReadOnlyCollection<IWebElement> elements = driver.FindElements(By.Id(elementID));
                       Assert.IsTrue(elements.Count == 0);
                   }
                   catch (OpenQA.Selenium.StaleElementReferenceException) {
                       Assert.IsTrue(true);
                   }
               });

        public static readonly TestCase DeleteSHACLProperty =
          new TestCase(
            "SHACL properties can be deleted",
            (driver, log) =>
            {
                driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
                //Log in
                driver.ByPassLogin();

                //Open a SHACL file
                driver.OpenSHACLFile("demo_shacl.ttl");
                var shaclElement = driver.FindElement(By.XPath("//*[contains(text(),'sh:targetClass')]"), 10);
                String elementID = shaclElement.GetAttribute("id");
                Assert.IsTrue(shaclElement.Text == "sh:targetClass : ex:Person");
                //Element is selected
                shaclElement.Click();
                SendKeys.SendWait("{DEL}");
                System.Threading.Thread.Sleep(500);
                try
                {
                    IReadOnlyCollection<IWebElement> elements = driver.FindElements(By.Id(elementID));
                    Assert.IsTrue(elements.Count == 0);
                }
                catch (OpenQA.Selenium.StaleElementReferenceException)
                {
                    Assert.IsTrue(true);
                }

            });

        public static readonly TestCase DeleteDataAttribute=
        new TestCase(
          "SHACL properties can be deleted",
          (driver, log) =>
          {
              driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
                //Log in
                driver.ByPassLogin();

                //Open a SHACL file
                driver.OpenDataFile("demo_data_conforming.ttl");
              var dataElement = driver.FindElement(By.XPath("//*[contains(text(),'Person')]"), 10);
              String elementID = dataElement.GetAttribute("id");
              Assert.IsTrue(dataElement.Text.Contains("Person"));
              //Element is selected
              dataElement.Click();
              SendKeys.SendWait("{DEL}");
              System.Threading.Thread.Sleep(500);
              try
              {
                  IReadOnlyCollection<IWebElement> elements = driver.FindElements(By.Id(elementID));
                  Assert.IsTrue(elements.Count == 0);
              }
              catch (OpenQA.Selenium.StaleElementReferenceException)
              {
                  Assert.IsTrue(true);
              }

          });

        public static readonly ICollection<TestCase> All =
        new[]
    {
            DeleteSHACLShape,
            DeleteDataShape,
            DeleteSHACLProperty,
            DeleteDataAttribute
    };
    }
}
