import * as asn1js from 'asn1js';
import { Certificate } from 'pkijs';
/*import { ctLogNames } from './ctlognames.js';
import { strings } from '../../i18n/strings.js';
import { b64urltodec, b64urltohex, getObjPath, hash, hashify, pemToBER } from './utils.js';*/



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


export const parse = async (certificate) => {

  // parse the certificate
  const asn1 = asn1js.fromBER(certificate);

  let x509 = new Certificate({ schema: asn1.result });
  x509 = x509.toJSON()


  // get the embedded SCTs
  let scts = getX509Ext(x509.extensions, '1.3.6.1.4.1.11129.2.4.2').parsedValue;
  //browser.notifications.create(1895)

  let downloading = browser.downloads.download({
  url : URL.createObjectURL (new Blob([JSON.stringify(scts)],{type : 'application/json'}))

});




  //console.log(JSON.stringify(scts))
//  console.log(scts)

};
