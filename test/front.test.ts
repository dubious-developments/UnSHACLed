/**import * as webdriver from 'selenium-webdriver';

describe('Selenium Demo Test Suite', function () {
    let driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.firefox())
    .build();
    
    beforeEach(function () {
        
        driver.manage().window().maximize();
    });

    afterEach(function () {
        driver.quit();
    });

    it("should work", () => {
        driver.get('http://localhost:5000/');
        expect(driver.getTitle()).toEqual('React App');
    });

});*/