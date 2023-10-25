## Get multiple URL in one CLI invocation

```sh
all_proxy=socks5h://localhost:1080 curl 'https://ia600307.us.archive.org/BookReader/BookReaderImages.php?zip=/3/items/RedBookAudioRecordingCompactDiscDigitalAudioSystemIEC60908SecondEdition199902ISBN2831846382/Red%20Book%20-%20Audio%20Recording%20Compact%20Disc%20Digital%20Audio%20System%2C%20IEC%2060908%2C%20Second%20Edition%2C%201999-02%20%5BISBN%202-8318-4638-2%5D_jp2.zip&file=Red%20Book%20-%20Audio%20Recording%20Compact%20Disc%20Digital%20Audio%20System%2C%20IEC%2060908%2C%20Second%20Edition%2C%201999-02%20%5BISBN%202-8318-4638-2%5D_jp2/Red%20Book%20-%20Audio%20Recording%20Compact%20Disc%20Digital%20Audio%20System%2C%20IEC%2060908%2C%20Second%20Edition%2C%201999-02%20%5BISBN%202-8318-4638-2%5D_[0000-0217].jp2&id=RedBookAudioRecordingCompactDiscDigitalAudioSystemIEC60908SecondEdition199902ISBN2831846382&scale=2&rotate=0' -o '#1.jpg'
```

## TODO

```sh
# curl -v --http2 https://sunsite.unc.edu -A 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
* Host sunsite.unc.edu:443 was resolved.
* IPv6: (none)
* IPv4: 152.19.134.40
*   Trying 152.19.134.40:443...
* Connected to sunsite.unc.edu (152.19.134.40) port 443
* ALPN: curl offers h2,http/1.1
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
*  CAfile: /etc/ssl/certs/ca-certificates.crt
*  CApath: none
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / x25519 / RSASSA-PSS
* ALPN: server accepted h2
* Server certificate:
*  subject: C=US; ST=North Carolina; O=The University of North Carolina at Chapel Hill; CN=www.ibiblio.org
*  start date: Nov  8 00:00:00 2023 GMT
*  expire date: Nov  7 23:59:59 2024 GMT
*  subjectAltName does not match sunsite.unc.edu
* SSL: no alternative certificate subject name matches target host name 'sunsite.unc.edu'
* Closing connection
* TLSv1.3 (OUT), TLS alert, close notify (256):
