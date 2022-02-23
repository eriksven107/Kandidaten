// Instruktionar att få skiten att fungera fast istället för att skapa ny path flyttade jag geckodrivers till en existerande path 
//https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Your_own_automation_environment

const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

const driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

driver.get('http://www.google.com');
console.log("Hej");
//var status =gbrowser.securityUI.QueryInterface(Components.interfaces.nsISSLStatusProvider).SSLStatus;
//alert(status.serverCert.issuerName);
