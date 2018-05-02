.PHONY: nuget clean all

all:
	msbuild selenium.sln

nuget:
	nuget restore
	cd packages/Selenium.WebDriver.GeckoDriver.0.20.1; unzip -u Selenium.WebDriver.GeckoDriver.0.20.1.nupkg; cd ../..

clean:
	rm -rf packages/ bin/ obj/
