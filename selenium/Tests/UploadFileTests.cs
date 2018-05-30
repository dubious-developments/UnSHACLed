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
                driver.ByPassLogin();
                //Open a SHACL file
                driver.OpenSHACLFile("demo_shacl.ttl");
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
                    driver.ByPassLogin();
                    //Open a SHACL file
                    driver.OpenDataFile("demo_data_conforming.ttl");
                    var dataElement = driver.FindElement(By.XPath("//*[contains(text(),'Alice')]"), 10);
                    Assert.IsTrue(dataElement.Text.Contains("Alice"));
                });

        public static readonly TestCase uploadMultipleFiles =
            new TestCase("" +
                "Multiple files can be uploaded",
                (driver, log) =>
                {
                    driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
                    //Log in
                    driver.ByPassLogin();
                    driver.OpenSHACLFile("demo_shacl.ttl");
                    driver.OpenDataFile("demo_data_conforming.ttl");
                    var dataElement = driver.FindElement(By.XPath("//*[contains(text(),'Alice')]"), 10);
                    Assert.IsTrue(dataElement.Text.Contains("Alice"));
                    var shaclElement = driver.FindElement(By.XPath("//*[contains(text(),'sh:targetClass')]"), 10);
                    Assert.IsTrue(shaclElement.Text == "sh:targetClass : ex:Person");
                });

        public static readonly ICollection<TestCase> All =
        new[]
    {
            UploadSHACLFile,
            UploadDataFile
    };
    }
}


