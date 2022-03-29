import { consume } from './consumer';

browser.webRequest.onHeadersReceived.addListener(
  details => { consume(details);


  },
  { urls: ['<all_urls>'] },
  ['blocking'],


);
