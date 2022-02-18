package main

import (
  "fmt"
  "crypto/tls"
  "encoding/asn1"
)

var embedded_count int =0
var tsl_ext_count int =0
var ocsp_count int = 0


func get_sct(page string) {
//Ansluter till sida lagrad i page
  conn, err := tls.Dial("tcp", page + ":443", &tls.Config{
      InsecureSkipVerify: true,
  })
  if err != nil {
      fmt.Println(err)
      return
  }




    embedded_sct := conn.ConnectionState().PeerCertificates[0].Extensions
    tls_timestamp:=conn.ConnectionState().SignedCertificateTimestamps
    ocspo_stap:=conn.ConnectionState().OCSPResponse
    //Kollar certifikatets extentions efter id: 1, 3, 6, 1, 4, 1, 11129, 2, 4, 2

    for i := 0;i<len(embedded_sct);i++ {

      if embedded_sct[i].Id.Equal(asn1.ObjectIdentifier{1, 3, 6, 1, 4, 1, 11129, 2, 4, 2})  {
      /*  fmt.Print("\n")
        fmt.Print(i)
        fmt.Print(embedded_sct[i])
        fmt.Print("\n")*/
        embedded_count++
        break
      }

    }


    if len(tls_timestamp)!=0 {tsl_ext_count++}

    if len(ocspo_stap)!=0 {ocsp_count++}


}

func main() {
   page_list := [5]string{"google.com","youtube.com","facebook.com","netflix.com","microsoft.com" }
  for j := 0;j<len(page_list);j++ {

    get_sct(page_list[j])
  }


    fmt.Print("Embedded SCT?\n")
    fmt.Print(embedded_count)
    fmt.Print("\nAs a TLS extension in the handshake?\n")
    fmt.Print(tsl_ext_count)
    fmt.Print("\nOCSP Stapeling?\n")
    fmt.Print(ocsp_count)

}
