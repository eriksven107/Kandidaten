package main

import (
  "fmt"
  "os"
  "bytes"
  "encoding/pem"
  "crypto/tls"
//  "crypto/x509"
)

func main() {
  conn, err := tls.Dial("tcp", os.Args[1] + ":443", &tls.Config{
      InsecureSkipVerify: true,
  })
  if err != nil {
      fmt.Println(err)
      return
  }

  var encodedCert bytes.Buffer
  err = pem.Encode(&encodedCert, &pem.Block{
    Type: "CERTIFICATE",
    Bytes: conn.ConnectionState().PeerCertificates[0].Raw,
  })
  if err != nil {
    fmt.Println(err)
    return
  }

/*  p, err := x509.MarshalPKIXPublicKey(conn.ConnectionState().PeerCertificates[0].PublicKey)
  if err != nil {
    fmt.Println(err)
    return
  }
  publicKey := string(pem.EncodeToMemory(&pem.Block{
    Type:  "PUBLIC KEY",
    Bytes: p,
  }))*/

  fmt.Print("A")
  fmt.Print(conn.ConnectionState().PeerCertificates[0])
  fmt.Print("B")
  fmt.Print(conn.ConnectionState().SignedCertificateTimestamps)
  fmt.Print("C")
  fmt.Print(conn.ConnectionState().OCSPResponse)


}
