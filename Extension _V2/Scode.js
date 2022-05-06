
const {Builder, Capabilities} = require('selenium-webdriver');
const fs = require('fs');
const firefox = require('selenium-webdriver/firefox');


(async function example() {
  let options = new firefox.Options().addExtensions('certainly_something_certificate_viewer_-1.2.3.zip');
  const caps = new Capabilities();
  caps.setPageLoadStrategy("normal");
  for (let i=0;i<100;i++){

    let driver = await new Builder()

      .setFirefoxOptions(options)
      .withCapabilities(caps)
      .forBrowser('firefox')
      .build();

      new firefox.Driver(driver.getSession(), driver.getExecutor()).installAddon("certainly_something_certificate_viewer_-1.2.3.zip", true);



    try {

        await driver.get('https://www.google.com/');
      await driver.get('https://www.olleocherik.com/');







    } finally {

      await new Promise(resolve => setTimeout(resolve, 5000));
      driver.quit();
    }
}
})();
