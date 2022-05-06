// Instruktionar att få skiten att fungera fast istället för att skapa ny path flyttade jag geckodrivers till en existerande path
//https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Your_own_automation_environment

/*const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;


FirefoxProfile profile= new FirefoxProfile();
profile.addExtention(new File("a2fff151f5ad0ef63cbd7e454e8907c1fa9cc32008f489178775570374f408a7@pokeinthe.io.xpi"));

options.setProfile(profile);

const driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

driver.get('http://www.google.com');
*/
//https://stackoverflow.com/questions/61993990/is-there-a-way-to-add-extension-on-startup-firefox-with-selenium-on-nodejs

const {Builder} = require('selenium-webdriver');
const fs = require('fs');
const firefox = require('selenium-webdriver/firefox');

(async function example() {
  let options = new firefox.Options().addExtensions('certainly_something_certificate_viewer_-1.2.3.zip');

  let driver = await new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();

    new firefox.Driver(driver.getSession(), driver.getExecutor()).installAddon("certainly_something_certificate_viewer_-1.2.3.zip", true);



  try {
    await driver.get('https://google.com/');

    await new Promise(resolve => setTimeout(resolve, 5000));


  } finally {
    driver.navigate().refresh();
    //await driver.quit();
  }
})();

/*async function logSubject(details) {
  try {
    let securityInfo = await browser.webRequest.getSecurityInfo(details.requestId, {});
    console.log(details.url);
    if (securityInfo.state === "secure" || securityInfo.state === "weak") {
      console.log(securityInfo.certificates[0].subject);
    }
  }
  catch(error) {
    console.error(error);
  }
}

browser.webRequest.onHeadersReceived.addListener(logSubject,
  {urls: ["http://www.google.com/*"]},
  ["blocking"]
);
*/
//var status =gbrowser.securityUI.QueryInterface(Components.interfaces.nsISSLStatusProvider).SSLStatus;
//alert(status.serverCert.issuerName);
