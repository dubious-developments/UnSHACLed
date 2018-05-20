using System.Collections.Generic;
using OpenQA.Selenium;
using System;

namespace SeleniumTests.Tests
{
    class UploadFileTests
    {
        public static readonly TestCase UploadSHACLFile =
            new TestCase(
            "SHACL files can be uploaded",
            (driver, log) =>
            {
                driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
                //Log in
                driver.Login();
                //Open a SHACL file
                driver.OpenFile("demo_shacl.ttl");
                var shaclElement = driver.FindElement(By.XPath("//*[contains(text(),'sh:targetClass')]"), 10);
                Assert.IsTrue(shaclElement.Text == "sh:targetClass : ex:Person");
             });

        public static readonly TestCase UploadDataFile =
            new TestCase(
                "Data files can be uploaded",
                (driver, log) =>
                {
                    driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
                    //Log in
                    driver.Login();
                    //Open a SHACL file
                    driver.OpenFile("demo_data_conforming.ttl");
                    var dataElement = driver.FindElement(By.XPath("//*[contains(text(),'ex:Alice')]"), 10);
                    Assert.IsTrue(dataElement.Text == "ex:Alice");
                });

        public static readonly ICollection<TestCase> All =
        new[]
    {
            UploadSHACLFile,
            UploadDataFile
    };
    }
}


