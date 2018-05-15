using System.Collections.Generic;
using OpenQA.Selenium;
using System.Windows.Forms;
using OpenQA.Selenium.Interactions;
using System;
using OpenQA.Selenium.Support.UI;

namespace SeleniumTests.Tests
{
    static class Help
    {

        public static IWebElement FindElement(this IWebDriver driver, By by, int timeoutInSeconds)
        {
            if (timeoutInSeconds > 0)
            {
                var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(timeoutInSeconds));
                return wait.Until(drv => drv.FindElement(by));
            }
            return driver.FindElement(by);
        }

        public static IReadOnlyCollection<IWebElement> FindElements(this IWebDriver driver, By by, int timeoutInSeconds)
        {
            if (timeoutInSeconds > 0)
            {
                var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(timeoutInSeconds));
                return wait.Until(drv => drv.FindElements(by));
            }
            return driver.FindElements(by);
        }

        public static void DoubleClick(this IWebDriver driver, IWebElement element)
        {
            Actions action = new Actions(driver);
            action.DoubleClick(element);
            action.Perform();
        }

        public static void Login(this IWebDriver driver)
        {
            var elem = driver.FindElement(By.Id("homeLoginButton"));
            elem.Click();
            Assert.IsTrue(driver.Url.EndsWith("#/login"));
            driver.FindElement(By.Id("formUsernameField")).SendKeys("username");
            driver.FindElement(By.Id("formPasswordField")).SendKeys("password");
            var login = driver.FindElement(By.Id("formLoginButton"));
            login.Click();
        }

        public static void OpenFile(this IWebDriver driver, String path)
        {
            var fileMenu = driver.FindElement(By.Id("openFileMenu"), 10);
            fileMenu.Click();
            var localGraph = driver.FindElement(By.Id("openLocalGraphButton"), 10);
            localGraph.Click();
            var shaclGraph = driver.FindElement(By.Id("openSHACLGraphButton"), 10);
            shaclGraph.Click();
            SendKeys.SendWait(path);
            System.Threading.Thread.Sleep(500);
            SendKeys.SendWait(@"{Enter}");
            System.Threading.Thread.Sleep(1000);
        }
    }
}
