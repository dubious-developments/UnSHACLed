nuget restore
msbuild selenium.sln
bin\Debug\selenium-tests.exe %1 --no-build-app --print-app-url
