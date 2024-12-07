import { NginxConfig } from "../src";

const config = new NginxConfig();

config.user("nginx");
config.workerProcesses("auto");
config.pid("/run/nginx.pid");

config.events().workerConnections(1024).multiAccept(true).useEpoll(true);

const http = config.http();

http
  .keepaliveTimeout(65)
  .sendfile(true)
  .defaultType("application/octet-stream")
  .tcpNopush(true)
  .tcpNodelay(true)
  .clientMaxBodySize("10m")
  .clientBodyBufferSize("128k");

const server = http.addServer(80);
server
  .serverName("example.com www.example.com")
  .root("/var/www/html")
  .index("index.html")
  .accessLog("/var/log/nginx/access.log", "combined")
  .errorLog("/var/log/nginx/error.log", "warn");

console.log(config.build());
