# Nginx Config Builder

A TypeScript library for building Nginx configuration files programmatically.

## Installation

```bash
npm install @dwikyrza/nginx-config-builder
```

## Usage

This library provides two main classes for building Nginx configurations:

### NginxConfig

`NginxConfig` is designed for creating complete Nginx configurations, including HTTP, events, and other top-level directives. Use this when you need to generate a full `nginx.conf` file.

```ts
import { NginxConfig } from "@dwikyrza/nginx-config-builder";

const config = new NginxConfig();

config.user("nginx");
config.workerProcesses("auto");
config.pid("/run/nginx.pid");

config
  .events()
  .workerConnections(1024)
  .multiAccept(true)
  .useEpoll(true)
  .acceptMutex(true)
  .acceptMutexDelay(500);

const http = config.http();

http.applyTypedDirectives({
  keepalive_timeout: 65,
  sendfile: true,
  default_type: "application/octet-stream",
  tcp_nopush: true,
  tcp_nodelay: true,
});

http
  .clientMaxBodySize("10m")
  .clientBodyBufferSize("128k")
  .clientHeaderTimeout(60)
  .clientBodyTimeout(60)
  .sendTimeout(60)
  .gzip(true)
  .gzipTypes([
    "text/plain",
    "text/css",
    "application/json",
    "application/javascript",
    "text/xml",
    "application/xml",
  ])
  .gzipMinLength("1000")
  .gzipComp(6);

http
  .addUpstream("backend_servers")
  .server("127.0.0.1:8001")
  .server("127.0.0.1:8002")
  .server("127.0.0.1:8003")
  .leastConn();

const server = http.addServer(80);
server.serverName("example.com www.example.com");
server.accessLog("/var/log/nginx/access.log", "combined");
server.errorLog("/var/log/nginx/error.log", "warn");

server.listen(443, true);
server.sslCertificate("/etc/nginx/ssl/example.com.crt");
server.sslCertificateKey("/etc/nginx/ssl/example.com.key");
server.sslProtocols("TLSv1.2", "TLSv1.3");

server
  .addLocation("/")
  .root("/var/www/html")
  .index("index.html", "index.htm")
  .tryFiles("$uri", "$uri/", "/index.html");

server
  .addLocation("/api")
  .proxyPass("http://backend_servers")
  .proxyBuffering(false)
  .proxySetHeader("X-Real-IP", "$remote_addr")
  .proxySetHeader("X-Forwarded-For", "$proxy_add_x_forwarded_for")
  .proxySetHeader("X-Forwarded-Proto", "$scheme")
  .proxySetHeader("Host", "$host");

server
  .addLocation("/")
  .addHeader("X-Frame-Options", "DENY")
  .addHeader("X-Content-Type-Options", "nosniff")
  .addHeader("X-XSS-Protection", "1; mode=block")
  .addHeader("Referrer-Policy", "strict-origin-when-cross-origin");

const output = config.build();
console.log(output);
```

Output:

```nginx
user nginx;

worker_processes auto;

pid /run/nginx.pid;

events {
    worker_connections 1024;
    multi_accept on;
    use epoll;
    accept_mutex on;
    accept_mutex_delay 500ms;
}

http {
    sendfile on;
    keepalive_timeout 65;
    default_type application/octet-stream;
    tcp_nopush on;
    tcp_nodelay on;

    client_max_body_size 10m;
    client_body_buffer_size 128k;
    client_header_timeout 60;
    client_body_timeout 60;
    send_timeout 60;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;
    gzip_comp_level 6;

    upstream backend_servers {
        server 127.0.0.1:8001;
        server 127.0.0.1:8002;
        server 127.0.0.1:8003;
        least_conn;
    }

    server {
        listen 80;
        server_name example.com www.example.com;
        access_log /var/log/nginx/access.log combined;
        error_log /var/log/nginx/error.log warn;
        listen 443 ssl;
        ssl_certificate /etc/nginx/ssl/example.com.crt;
        ssl_certificate_key /etc/nginx/ssl/example.com.key;
        ssl_protocols TLSv1.2 TLSv1.3;

        location  / {
            root /var/www/html;
            index index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

        location  /api {
            proxy_pass http://backend_servers;
            proxy_buffering off;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Host $host;
        }

        location  / {
            add_header X-Frame-Options DENY;
            add_header X-Content-Type-Options nosniff;
            add_header X-XSS-Protection 1; mode=block;
            add_header Referrer-Policy strict-origin-when-cross-origin;
        }
    }
}
```

### SiteConfig

`SiteConfig` is focused on creating individual server configurations. It's ideal for generating site-specific configurations that will be included in the main Nginx configuration. Use this when you want to create configurations for individual sites in `/etc/nginx/sites-available/`.

```ts
import { SiteConfig } from "@dwikyrza/nginx-config-builder";

const config = new SiteConfig();

const site = config.addServer(80);

site.serverName("example.com");
site.addLocation("/").root("/var/www/html").index("index.html", "index.htm");
site
  .addLocation("/api")
  .proxyPass("http://localhost:3000")
  .proxyBuffering(false)
  .proxySetHeader("X-Real-IP", "$remote_addr")
  .proxySetHeader("X-Forwarded-For", "$proxy_add_x_forwarded_for")
  .proxySetHeader("X-Forwarded-Proto", "https");

const output = config.build();
console.log(output);
```

Output:

```nginx
server {
    listen 80;

    server_name example.com;

    location / {
        root /var/www/html;
        index index.html index.htm;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_buffering off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

## Key Differences

- **NginxConfig**: Creates complete Nginx configurations including:

  - Top-level directives (user, worker_processes, pid)
  - Events block configuration
  - HTTP block with multiple servers
  - Upstream and map configurations
  - Suitable for generating main `nginx.conf`

- **SiteConfig**: Focuses on server-level configuration:
  - Single server block configuration
  - No top-level directives or HTTP block
  - Ideal for site-specific configurations
  - Perfect for `/etc/nginx/sites-available/` configurations

## Examples

For more examples, please refer to the [examples](https://github.com/kyzsuukii/nginx-config-builder/tree/master/examples) folder.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
