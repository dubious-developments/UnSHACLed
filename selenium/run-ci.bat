nuget restore
msbuild selenium.sln
bin\Debug\selenium-tests.exe --no-build-app --print-app-url
