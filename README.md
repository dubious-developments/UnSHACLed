# UnSHACLed web application

Hi there! UnSHACLed is a visual editor for SHACL, still in its early stages.

## Trying UnSHACLed live

You can try out UnSHACLed's [latest release](http://193.190.127.184) or its [latest nightly release](http://193.190.127.184:8800) from the comfort of your favorite browser.

## CI

Operating system | Status
---------------- | ------
Linux and Mac OS X | [![Build Status](https://travis-ci.org/dubious-developments/UnSHACLed.svg?branch=master)](https://travis-ci.org/dubious-developments/UnSHACLed)
Windows | [![Build status](https://ci.appveyor.com/api/projects/status/9jhin9m8rocfm0p4/branch/master?svg=true)](https://ci.appveyor.com/project/jonathanvdc/unshacled)

SonarCloud dashboard can be found [here](https://sonarcloud.io/dashboard?id=org.dubious-developments.unshacled). For some reason, SonarCloud won't show an accurate test coverage report. You can find an accurate report [here](http://193.190.127.184:8800/coverage/index.html).

## Building UnSHACLed

Dependencies:

  * `npm` (`sudo apt install npm`)
  * `gulp` (`sudo npm install -g gulp`)


Build instructions:

  * Install all other dependencies by running `npm install`.
  * Lint, build and test by typing `gulp`.

To view the website, open `index.html` with your favorite web browser.

