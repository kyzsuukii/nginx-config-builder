import { NginxConfig } from "../src";

const config = new NginxConfig();

config.user("nginx");
config.workerProcesses("auto");
config.pid("/run/nginx.pid");

const events = config.events();
events.workerConnections(1024);

const http = config.http();

http.addDirective("include /etc/nginx/mime.types");
http.addDirective("default_type application/octet-stream");
http.addDirective(
  "log_format custom '$remote_addr - $remote_user [$time_local] \"$request\"'"
);
http.addDirective("access_log /var/log/nginx/access.log custom");
http.addDirective("sendfile on");
http.addDirective("keepalive_timeout 65");
http.addDirective("gzip on");
http.addDirective(
  "gzip_types text/plain text/css application/json application/javascript text/xml application/xml"
);

const server = http.addServer(80);
server.addDirective("server_name example.com www.example.com");
server.addDirective("root /var/www/html");
server.addDirective("index index.html index.htm");

const location = server.addLocation("/");
location.addDirective("try_files $uri $uri/ =404");

console.log(config.build());
