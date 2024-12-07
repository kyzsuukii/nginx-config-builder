import { NginxConfig } from "../src";

const config = new NginxConfig();

const http = config.http();

http
  .addUpstream("backend_servers")
  .server("127.0.0.1:8001", { weight: 3, maxFails: 3, failTimeout: "30s" })
  .server("127.0.0.1:8002", { weight: 2, backup: true })
  .server("127.0.0.1:8003", { down: true })
  .leastConn()
  .keepalive(32)
  .keepaliveRequests(100)
  .keepaliveTimeout(60)
  .queue(100, "30s")
  .zone("upstream_dynamic", "10m")
  .slowStart("30s");

const server = http.addServer(80);
server.serverName("example.com").root("/var/www/html").index("index.html");

server
  .addLocation("/api")
  .proxyPass("http://backend_servers")
  .proxyBuffering(false)
  .proxyBufferSize("128k")
  .proxyReadTimeout("90s")
  .proxyConnectTimeout("90s")
  .proxySendTimeout("90s")
  .proxySetHeader("X-Real-IP", "$remote_addr")
  .proxySetHeader("X-Forwarded-For", "$proxy_add_x_forwarded_for")
  .proxySetHeader("X-Forwarded-Proto", "$scheme")
  .proxySetHeader("Host", "$host");

console.log(config.build());
