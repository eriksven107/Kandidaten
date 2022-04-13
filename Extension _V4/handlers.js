// 	User Agent Normal: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:98.0) Gecko/20100101 Firefox/98.0 Selenium:


import * as asn1js from 'asn1js';
import { fromBase64, stringToArrayBuffer} from 'pvutils';
import { Certificate } from 'pkijs';

const getX509Ext = (extensions, v) => {
  for (var extension in extensions) {
    if (extensions[extension].extnID === v) {
      return extensions[extension];
    }
  }

  return {
    extnValue: undefined,
    parsedValue: undefined,
  };

};


export const parse = async (certificate,issuerkeyhash) => {

  // parse the certificate
  const asn1 = asn1js.fromBER(certificate);


  let x509 = new Certificate({ schema: asn1.result });

  x509 = x509.toJSON()

  // get the embedded SCTs
  let scts = getX509Ext(x509.extensions, '1.3.6.1.4.1.11129.2.4.2').parsedValue;


let data=[];
if(!(scts === undefined)) {
  data[0]="SCTs"
  data[1]=scts;
  data[2]="\n tbs:"
  data[3]=x509['tbs']
  data[4]="\n issuerkeyhash:";
  data[5]=issuerkeyhash;



 let sctfile=new Blob([JSON.stringify(data)],{type : 'application/json'})

 let downloading = browser.downloads.download({


  url : URL.createObjectURL (sctfile)

});


}
};




export const pemToBER = (pem) => {
  return stringToArrayBuffer(window.atob(pem));
};

// returns an object with a certs array: it either inserts them into an existing securityInfo
// object, or it creates a new object containing only the certs
export const buildChain = async (chain) => {
  let builtChain;

  let issuerkeyhash=chain[1]['subjectPublicKeyInfoDigest'];


  // probably a PEM encoded certificate
  if (typeof chain === 'string' && chain.includes('-----BEGIN CERTIFICATE-----')) {
    builtChain = chain.trim()
                      .replace(/\r|\n|\0/g, '')
                      .split(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----/g)
                      .filter(v => v.startsWith('MII'));

    builtChain = builtChain.map(cert => { return pemToBER(cert) });
    //console.log(builtChain);
  } else if (chain.buffer) {   // DER encoded
    builtChain = [ chain.buffer ];
  } else if (typeof chain === 'object' && Array.isArray(chain)) {
    builtChain = chain.map(cert => { return new Uint8Array(cert.rawDER).buffer });
  }
  else {console.log("else");}

  // now we need to parse each of the certificates, and return the parsed chain
  return await Promise.all(builtChain.map(cert => parse(cert,issuerkeyhash)));
};


export const consume = async details => {

  const mainFrame = details.type === 'main_frame';
  let securityInfo;

  // only pull security info on top level requests
  if (mainFrame) {


    // grab the security info
    securityInfo = await browser.webRequest.getSecurityInfo( // fetch the security info
      details.requestId,
      { certificateChain: true, rawDER: true }); //Prova med certificateChain: false, bara första borde ha sct?

    if (securityInfo !== undefined) {
      // sometimes securityInfo doesn't return keaGroupName for whatever reason
      if (!securityInfo.keaGroupName) {
        securityInfo.keaGroupName = undefined;
      }

      buildChain(securityInfo['certificates']);

    return;
  }

   }
};



browser.webRequest.onHeadersReceived.addListener(
  details => { consume(details);


  },
  { urls: ['<all_urls>'] },
  ['blocking'],


);
