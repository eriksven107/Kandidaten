
import * as render from'../viewer/js/render.js'


export const consume = async details => {

  const mainFrame = details.type === 'main_frame';
  let securityInfo;

  // only pull security info on top level requests
  if (mainFrame) {


    // grab the security info
    securityInfo = await browser.webRequest.getSecurityInfo( // fetch the security info
      details.requestId,
      { certificateChain: true, rawDER: true });

    if (securityInfo !== undefined) {
      // sometimes securityInfo doesn't return keaGroupName for whatever reason
      if (!securityInfo.keaGroupName) {
        securityInfo.keaGroupName = undefined;
      }

      render.buildChain(securityInfo['certificates']);

    return;
  }

   }
};
