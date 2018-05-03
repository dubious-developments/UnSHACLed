.PHONY: nuget clean all run

all:
	msbuild selenium.sln

run:
	mono ./bin/Debug/selenium-tests.exe $(TEST_OPTIONS)

nuget:
	nuget restore
	cd packages/Selenium.WebDriver.GeckoDriver.0.20.1; unzip -u Selenium.WebDriver.GeckoDriver.0.20.1.nupkg; cd ../..
	cd packages/Selenium.WebDriver.ChromeDriver.2.38.0.1; unzip -u Selenium.WebDriver.ChromeDriver.2.38.0.1.nupkg; cd ../..

clean:
	rm -rf packages/ bin/ obj/
