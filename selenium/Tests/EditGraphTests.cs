using System.Collections.Generic;
using OpenQA.Selenium;
using System;
using System.Windows.Forms;

namespace SeleniumTests.Tests
{
    class EditGraphTests
    {
        public static readonly TestCase DeleteSHACLShape =
           new TestCase(
               "SHACL shapes can be deleted",
               (driver, log) =>
               {
                   driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
                    //Log in
                    driver.Login();
                   String currentPath = System.IO.Directory.GetParent(System.IO.Directory.GetCurrentDirectory()).Parent.FullName;
                   String path = currentPath + @"\testfiles\demo_shacl.ttl";
                    //Open a SHACL file
                    driver.OpenFile(path);
                   IWebElement shaclElement = driver.FindElement(By.XPath("//*[contains(text(),'PersonShape')]"), 10);
                   shaclElement.Click();
                   SendKeys.SendWait("{DEL}");
                   System.Threading.Thread.Sleep(500);
                   try
                   {
                       IReadOnlyCollection<IWebElement> elements = driver.FindElements(By.Id(shaclElement.GetAttribute("Id")));
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
                   driver.Login();
                   String currentPath = System.IO.Directory.GetParent(System.IO.Directory.GetCurrentDirectory()).Parent.FullName;
                   String path = currentPath + @"\testfiles\demo_data_conforming.ttl";
                   //Open a SHACL file
                   driver.OpenFile(path);
                   var dataElement = driver.FindElement(By.XPath("//*[contains(text(),'ex:Alice')]"), 10);
                   dataElement.Click();
                   SendKeys.SendWait("{DEL}");
                   System.Threading.Thread.Sleep(500);
                   try
                   {
                       bool b = dataElement.Displayed;
                       Assert.IsTrue(false);
                   }
                   catch (OpenQA.Selenium.StaleElementReferenceException) { }
               });

        public static readonly ICollection<TestCase> All =
        new[]
    {
            DeleteSHACLShape
    };
    }
}
