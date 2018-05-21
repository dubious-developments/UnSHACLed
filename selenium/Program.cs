using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.Safari;
using OpenQA.Selenium.Support.UI;
using Pixie;
using Pixie.Markup;
using Pixie.Options;
using Pixie.Terminal;
using Pixie.Terminal.Devices;
using Pixie.Transforms;
using SeleniumTests.Tests;

namespace SeleniumTests
{
    public static class Program
    {
        /// <summary>
        /// A sequence of all test cases to run.
        /// </summary>
        private static readonly IEnumerable<TestCase> TestCases = (ConformanceTests.All);

        public static int Main(string[] args)
        {
            // Acquire a log for printing output.
            var rawLog = new RecordingLog();

            // Create a derived log for printing diagnostics.
            var log = CreateDiagnosticLog(rawLog);

            // Parse command-line arguments.
            var optParser = new GnuOptionSetParser(Options.All, Options.Url);

            // Actually parse the options.
            var parsedOptions = optParser.Parse(args, log);

            if (rawLog.Contains(Severity.Error))
            {
                // Ouch. Command-line arguments were bad. Stop testing now.
                return 1;
            }

            if (parsedOptions.ContainsOption(Options.Color))
            {
                if (parsedOptions.GetValue<bool>(Options.Color))
                {
                    rawLog = new RecordingLog(
                        TerminalLog.AcquireStandardError(
                            new AnsiStyleManager(Console.Error)));
                }
                else
                {
                    rawLog = new RecordingLog(
                        TerminalLog.AcquireStandardError(
                            NoStyleManager.Instance));
                }
                log = CreateDiagnosticLog(rawLog);
            }

            if (parsedOptions.GetValue<bool>(Options.Help))
            {
                // Print a cute little help message (to stdout instead of stderr).
                var helpLog = TerminalLog.AcquireStandardOutput();
                helpLog.Log(
                    new Pixie.LogEntry(
                        Severity.Message,
                        new HelpMessage(
                            "Runs UnSHACLed's functional tests.",
                            "selenium-tests [url-or-options...]",
                            Options.All)));
                return 0;
            }

            
            string testUrl = parsedOptions.GetValue<string>(Options.Url);
            bool noUrl = string.IsNullOrWhiteSpace(testUrl);

            if ((noUrl && !parsedOptions.ContainsOption(Options.BuildApplication))
                || parsedOptions.GetValue<bool>(Options.BuildApplication))
            {
                // Build the application if there's no URL and `--no-build-app`
                // was not specified or if `--build-app` was specified.
                log.Log(
                    new Pixie.LogEntry(
                        Severity.Info,
                        "status",
                        "building UnSHACLed..."));
                BuildUnSHACLed();
                log.Log(
                    new Pixie.LogEntry(
                        Severity.Info,
                        "status",
                        "UnSHACLed built successfully!"));
            }

            Process serverProcess = null;
            if (noUrl)
            {
                // If nobody bothered to specify a URL, then we'll just have to
                // host it ourselves.
                serverProcess = HostUnSHACLed(8080, log);
                if (serverProcess == null)
                {
                    return 1;
                }
                testUrl = "http://localhost:8080/index.html";
            }

            var browserNames = parsedOptions.ContainsOption(Options.Browsers)
                ? parsedOptions.GetValue<IReadOnlyList<string>>(Options.Browsers)
                : new[] { "firefox" };

            var browsersToUse = ParseBrowserNames(browserNames, log);

            if (rawLog.Contains(Severity.Error))
            {
                // Couldn't parse the command-line args. Better quit now.
                return 1;
            }

            if (parsedOptions.GetValue<bool>(Options.PrintApplicationUrl))
            {
                log.Log(
                    new Pixie.LogEntry(
                        Severity.Message,
                        "application url",
                        Quotation.QuoteEvenInBold(
                            "the absolute app url is ",
                            testUrl,
                            ".")));
            }

            try
            {
                Run(testUrl, browsersToUse, log, rawLog);
            }
            finally
            {
                if (serverProcess != null)
                {
                    serverProcess.Kill();
                    serverProcess.Dispose();
                }
            }

            // If things went swimmingly, then return a zero exit code.
            // Otherwise, let the world know that something is wrong.
            return rawLog.Contains(Severity.Error) ? 1 : 0;
        }

        private static IReadOnlyDictionary<string, Func<IWebDriver>> Drivers =
            new Dictionary<string, Func<IWebDriver>>
        {
            {
                "firefox",
                () =>
                {
                    var options = new FirefoxOptions { LogLevel = FirefoxDriverLogLevel.Fatal };
                    options.SetLoggingPreference(LogType.Browser, LogLevel.Off);
                    options.SetLoggingPreference(LogType.Driver, LogLevel.Off);
                    options.SetLoggingPreference(LogType.Server, LogLevel.Off);
                    options.SetLoggingPreference(LogType.Profiler, LogLevel.Off);
                    options.SetLoggingPreference(LogType.Client, LogLevel.Off);
                    return new FirefoxDriver(options);
                }
            },
            {
                "chrome",
                () =>
                {
                    var options = new ChromeOptions();
                    options.SetLoggingPreference(LogType.Browser, LogLevel.Off);
                    options.SetLoggingPreference(LogType.Driver, LogLevel.Off);
                    return new ChromeDriver(options);
                }
            },
            {
                "safari",
                () =>
                {
                    var options = new SafariOptions();
                    options.SetLoggingPreference(LogType.Browser, LogLevel.Off);
                    options.SetLoggingPreference(LogType.Driver, LogLevel.Off);
                    return new SafariDriver(options);
                }
            }
                
        };

        /// <summary>
        /// Parses a list of browser names to use.
        /// </summary>
        /// <param name="names">The names to parse.</param>
        /// <param name="log">A log for sending errors to.</param>
        /// <returns>A list of web driver builders.</returns>
        private static IReadOnlyDictionary<string, Func<IWebDriver>> ParseBrowserNames(
            IEnumerable<string> names, ILog log)
        {
            var browsersToUse = new Dictionary<string, Func<IWebDriver>>();
            foreach (var name in names.Distinct())
            {
                if (Drivers.ContainsKey(name))
                {
                    browsersToUse[name] = Drivers[name];
                }
                else
                {
                    // Try to guess what the user meant.
                    var suggestion = NameSuggestion.SuggestName(name, Drivers.Keys);
                    if (suggestion == null)
                    {
                        // Log an error if we couldn't find a reasonable guess.
                        log.Log(
                            new Pixie.LogEntry(
                                Severity.Error,
                                "unknown browser",
                                Quotation.QuoteEvenInBold(
                                    "specified browser ",
                                    name,
                                    " is not a known browser.")));
                    }
                    else
                    {
                        // Give the user a hand otherwise.
                        var diff = Diff.Create(name, suggestion);
                        log.Log(
                            new Pixie.LogEntry(
                                Severity.Error,
                                "unknown browser",
                                Quotation.QuoteEvenInBold(
                                    "specified browser ",
                                    TextDiff.RenderDeletions(diff),
                                    " is not a known browser; did you mean ",
                                    TextDiff.RenderInsertions(diff),
                                    "?")));
                    }
                }
            }
            return browsersToUse;
        }

        /// <summary>
        /// Runs all the tests based on parsed command-line options
        /// and a log.
        /// </summary>
        /// <param name="uri">The URI to test.</param>
        /// <param name="driverBuilders">
        /// A mapping of driver names to functions that each produce
        /// a driver to run the tests with.
        /// </param>
        /// <param name="log">A log to send messages to.</param>
        /// <param name="progressLog">A log for progress messages.</param>
        private static void Run(
            string uri,
            IReadOnlyDictionary<string, Func<IWebDriver>> driverBuilders,
            ILog log,
            ILog progressLog)
        {
            var allTestCases = TestCases.ToArray();
            int testCaseCount = allTestCases.Length * driverBuilders.Count;
            int completedTestCases = 0;
            foreach (var builder in driverBuilders)
            {
                using (IWebDriver driver = builder.Value())
                {
                    foreach (var testCase in allTestCases)
                    {
                        // Always navigate to the front page first.
                        driver.Navigate().GoToUrl(uri);

                        // Then run the actual test case.
                        bool success = testCase.Run(driver, builder.Key, log);

                        completedTestCases++;
                        var percentage = 100.0 * completedTestCases / testCaseCount;

                        // Print a fancy progress message.
                        progressLog.Log(
                            new Pixie.LogEntry(
                                Severity.Info,
                                DecorationSpan.MakeBold(
                                    new ColorSpan(
                                        new Sequence(
                                            string.Format("[{0,3}%]", Math.Round(percentage)),
                                            " ",
                                            success
                                                ? new DegradableText("✓", new DegradableText("√", "v"))
                                                : new DegradableText("✗", "x")),
                                        success ? Colors.Green : Colors.Red)),
                                " ",
                                DecorationSpan.MakeBold(new Quotation(testCase.Description, 2)),
                                string.Format(" [{0}]", builder.Key)));
                    }
                }
            }
        }

        private static void BuildUnSHACLed()
        {
            var process = StartUnSHACLedProcess("gulp", "build");

            process.WaitForExit();
        }

        /// <summary>
        /// Starts a process with the UnSHACLed directory
        /// as working directory.
        /// </summary>
        /// <param name="fileName">The name of the process to launch.</param>
        /// <param name="arguments">The arguments to pass to the process.</param>
        /// <param name="redirectStandardOutput">
        /// Tells if the process' standard output should be redirected.
        /// </param>
        /// <returns>A handle to a process that has been launched.</returns>
        private static Process StartUnSHACLedProcess(
            string fileName,
            string arguments,
            bool redirectStandardOutput = false)
        {
            var process = new Process();
            process.StartInfo.WorkingDirectory = Directory.GetParent(Directory.GetCurrentDirectory()).FullName;
            process.StartInfo.FileName = fileName;
            process.StartInfo.Arguments = arguments;
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
            process.StartInfo.RedirectStandardOutput = redirectStandardOutput;
            process.StartInfo.CreateNoWindow = true;

            try
            {
                process.Start();
            }
            catch (Win32Exception)
            {
                process.Dispose();
                return null;
            }
            return process;
        }

        /// <summary>
        /// Hosts an instance of UnSHACLed on the local host.
        /// </summary>
        /// <param name="port">The port to host UnSHACLed on.</param>
        /// <param name="log">A log to send errors to.</param>
        /// <returns>
        /// The host process if it can be launched; otherwise, <c>null</c>.
        /// An error is logged by this function in the latter case.
        /// </returns>
        private static Process HostUnSHACLed(int port, ILog log)
        {
            // If nobody bothered to specify a URL, then we'll just have to
            // host it ourselves.
            string procName = "serve";
            string procArgs = "-s build -p " + port;
            var serverProcess = StartUnSHACLedProcess(procName, procArgs, true);
            if (serverProcess == null)
            {
                log.Log(
                    new Pixie.LogEntry(
                        Severity.Error,
                        "cannot host",
                        Quotation.QuoteEvenInBold(
                            "command ",
                            procName + " " + procArgs,
                            " failed to launch; do you have ",
                            procName,
                            " installed? If not, try ",
                            "npm install -g " + procName + "@6.5.3",
                            ".")));
                return null;
            }

            string expectedServerOutput = "serve: Running on port " + port;
            var serverOutput = serverProcess.StandardOutput.ReadLine();
            if (serverOutput == expectedServerOutput)
            {
                return serverProcess;
            }
            else
            {
                if (!serverProcess.HasExited)
                {
                    serverProcess.Kill();
                }
                serverProcess.Dispose();
                log.Log(
                    new Pixie.LogEntry(
                        Severity.Error,
                        "cannot host",
                        Quotation.QuoteEvenInBold(
                            "expected ",
                            procName,
                            " to reply with ",
                            expectedServerOutput,
                            " but instead it said ",
                            serverOutput,
                            "; assuming that something went terribly wrong.")));
                return null;
            }
        }

        /// <summary>
        /// Takes a raw log and turns it into a log that
        /// always prints diagnostics.
        /// </summary>
        /// <param name="rawLog">The raw log to accept.</param>
        /// <returns>A log that always prints diagnostics.</returns>
        private static ILog CreateDiagnosticLog(ILog rawLog)
        {
            // Turn all entries into diagnostics and word-wrap the output.
            return new TransformLog(
                rawLog,
                entry => {
                    var transformed = DiagnosticExtractor.Transform(entry, "selenium-tests");
                    return new Pixie.LogEntry(
                        transformed.Severity,
                        WrapBox.WordWrap(transformed.Contents));
                });
        }
    }
}
