import { NginxConfig } from "../src";

const config = new NginxConfig();

const http = config.http();

http
  .keepaliveTimeout(65)
  .sendfile(true)
  .tcpNopush(true)
  .tcpNodelay(true)
  .clientMaxBodySize("10m")
  .clientBodyBufferSize("128k")
  .clientHeaderTimeout(60)
  .clientBodyTimeout(60)
  .sendTimeout(60);

http
  .gzip(true)
  .gzipTypes([
    "text/plain",
    "text/css",
    "application/json",
    "application/javascript",
    "text/xml",
    "application/xml",
    "application/x-font-ttf",
    "font/opentype",
  ])
  .gzipMinLength("1000")
  .gzipComp(6);

const server = http.addServer(80);
server.serverName("example.com").root("/var/www/html").index("index.html");

server
  .addLocation("~ \\.(jpg|jpeg|png|gif|ico|css|js)$")
  .expires("30d")
  .addHeader("Cache-Control", "public, no-transform");

server.errorPage(404, "/404.html").errorPage([500, 502, 503, 504], "/50x.html");

console.log(config.build());
