.PHONY: nuget clean all run

all:
	msbuild selenium.sln

run:
	mono ./bin/Debug/selenium-tests.exe "http://www.google.com/"

nuget:
	nuget restore
	cd packages/Selenium.WebDriver.GeckoDriver.0.20.1; unzip -u Selenium.WebDriver.GeckoDriver.0.20.1.nupkg; cd ../..

clean:
	rm -rf packages/ bin/ obj/
