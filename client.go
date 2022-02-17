package main

import (
  "fmt"
  "os"
  "crypto/tls"
)

func main() {
  conn, err := tls.Dial("tcp", os.Args[1] + ":443", &tls.Config{
      InsecureSkipVerify: true,
  })
  if err != nil {
      fmt.Println(err)
      return
  }


  fmt.Print("Embedded SCT?")

    fmt.Print(conn.ConnectionState().PeerCertificates[0].Extensions)

  fmt.Print("As a TLS extension in the handshake?")

    fmt.Print(conn.ConnectionState().SignedCertificateTimestamps)

  fmt.Print("OCSP Stapeling?")

    fmt.Print(conn.ConnectionState().OCSPResponse)


}
