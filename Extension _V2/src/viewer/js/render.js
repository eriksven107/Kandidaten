import { parse } from './der.js';

import * as asn1js from 'asn1js';
import { fromBase64, stringToArrayBuffer} from 'pvutils';

let template = require('../index.handlebars');


export const pemToBER = (pem) => {
  return stringToArrayBuffer(window.atob(pem));
};

// returns an object with a certs array: it either inserts them into an existing securityInfo
// object, or it creates a new object containing only the certs
export const buildChain = async (chain) => {
  let builtChain;

  // probably a PEM encoded certificate
  if (typeof chain === 'string' && chain.includes('-----BEGIN CERTIFICATE-----')) {
    builtChain = chain.trim()
                      .replace(/\r|\n|\0/g, '')
                      .split(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----/g)
                      .filter(v => v.startsWith('MII'));

    builtChain = builtChain.map(cert => { return pemToBER(cert) });
  } else if (chain.buffer) {   // DER encoded
    builtChain = [ chain.buffer ];
  } else if (typeof chain === 'object' && Array.isArray(chain)) {
    builtChain = chain.map(cert => { return new Uint8Array(cert.rawDER).buffer });
  }
  else {console.log("else");}

  // now we need to parse each of the certificates, and return the parsed chain
  return await Promise.all(builtChain.map(cert => parse(cert)));
};
