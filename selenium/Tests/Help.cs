using System.Collections.Generic;
using OpenQA.Selenium;
using System.Windows.Forms;
using OpenQA.Selenium.Interactions;
using System;
using static System.IO.Directory;
using static System.IO.Path;
using OpenQA.Selenium.Support.UI;
using System.Collections;
using static System.Threading.Thread;

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
            String parentWindowHandler = driver.CurrentWindowHandle;
            String popup = null;
            var elem = driver.FindElement(By.Id("homeLoginButton"),10);
            elem.Click();
            Assert.IsTrue(driver.Url.EndsWith("#/login"));
            Sleep(1000);
            var loginButton = driver.FindElement(By.Id("formLoginButton"), 10);
            loginButton.Click();
            Sleep(2000);
            IReadOnlyCollection<String> handles = driver.WindowHandles;
            IEnumerator enumerator = handles.GetEnumerator();
            while (enumerator.MoveNext())
            {
                enumerator.MoveNext();
                popup = (String)enumerator.Current;
            }
            driver.SwitchTo().Window(popup);
            driver.FindElement(By.Id("login_field"),10).SendKeys("JonasBaes");
            driver.FindElement(By.Id("password"),10).SendKeys("mijnPasswoord"); //werkt niet, passwoord ingeven
            SendKeys.SendWait(@"{Enter}");
            Sleep(4000);
            driver.SwitchTo().Window(parentWindowHandler);
            IWebElement startEdit = driver.FindElement(By.Id("startEditingButton"), 10);
            startEdit.Click();
            Sleep(2000);
            Assert.IsTrue(driver.Url.EndsWith("#/user"));

        }
        
        public static void ByPassLogin(this IWebDriver driver)
        {
            String currentUrl = driver.Url;
            currentUrl = currentUrl + "user";
            driver.Navigate().GoToUrl(currentUrl);
        }


        public static void OpenSHACLFile(this IWebDriver driver, String fileName)
        {
            var fileMenu = driver.FindElement(By.Id("openFileMenu"), 10);
            fileMenu.Click();
            var localGraph = driver.FindElement(By.Id("openLocalGraphButton"), 10);
            localGraph.Click();
            var shaclGraph = driver.FindElement(By.Id("SHACLGraphButton"), 10);
            shaclGraph.Click();
            String currentPath = GetParent(GetCurrentDirectory()).Parent.FullName;
            String path = Combine(currentPath, "testfiles\\");
            path = Combine(path, fileName);
            SendKeys.SendWait(path);
            Sleep(1000);
            SendKeys.SendWait(@"{Enter}");
            Sleep(500);
        }

        public static void OpenDataFile(this IWebDriver driver, String fileName)
        {
            var fileMenu = driver.FindElement(By.Id("openFileMenu"), 10);
            fileMenu.Click();
            var localGraph = driver.FindElement(By.Id("openLocalGraphButton"), 10);
            localGraph.Click();
            var shaclGraph = driver.FindElement(By.Id("DataGraphButton"), 10);
            shaclGraph.Click();
            String currentPath = GetParent(GetCurrentDirectory()).Parent.FullName;
            String path = Combine(currentPath, "testfiles\\");
            path = Combine(path, fileName);
            SendKeys.SendWait(path);
            Sleep(1000);
            SendKeys.SendWait(@"{Enter}");
            Sleep(500);
        }

    }
}
