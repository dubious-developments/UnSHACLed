using System.Collections.Generic;
using OpenQA.Selenium;
using System;

namespace SeleniumTests.Tests
{
    class GraphTests
    {

        public static readonly TestCase DeleteSHACLProperty =
           new TestCase(
           "SHACL properties can be deleted",
       (driver, log) =>
       {
           driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
            //Log in
            driver.Login();
           String currentPath = System.IO.Directory.GetParent(System.IO.Directory.GetCurrentDirectory()).Parent.FullName;
           String path = currentPath + @"\testfiles\demo_shacl.ttl";
            //Open a SHACL file
            driver.OpenFile(path);
           var shaclElement = driver.FindElement(By.XPath("//*[contains(text(),'sh:targetClass')]"), 10);
           Assert.IsTrue(shaclElement.Text == "sh:targetClass : ex:Person");
       });

    }
}
