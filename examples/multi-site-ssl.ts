import { SiteConfig } from "../src";

const multiSite = new SiteConfig();

multiSite.include("/etc/nginx/mime.types").include("/etc/nginx/fastcgi_params");

const mainServer = multiSite
  .addServer(443, true)
  .serverName("secure.example.com")
  .root("/var/www/secure")
  .sslCertificate("/etc/ssl/certs/secure.example.com.crt")
  .sslCertificateKey("/etc/ssl/private/secure.example.com.key")
  .sslProtocols(["TLSv1.2", "TLSv1.3"])
  .sslCiphers("HIGH:!aNULL:!MD5");

mainServer
  .addLocation("/")
  .index("index.html", "index.htm")
  .tryFiles("$uri", "$uri/", "/index.html");

mainServer
  .addLocation("/api")
  .proxyPass("http://localhost:3000")
  .proxySetHeader("X-Real-IP", "$remote_addr")
  .proxySetHeader("X-Forwarded-For", "$proxy_add_x_forwarded_for")
  .proxySetHeader("Host", "$host");

multiSite
  .addServer(80)
  .serverName("secure.example.com")
  .returnDirective(301, "https://$server_name$request_uri");

console.log(multiSite.build());
