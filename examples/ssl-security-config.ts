import { NginxConfig } from "../src";

const config = new NginxConfig();

const http = config.http();

http.sslSessionCache("shared:SSL:10m").sslSessionTimeout("10m");

const server = http.addServer(443, true);
server
  .serverName("example.com")
  .sslCertificate("/etc/nginx/ssl/example.com.crt")
  .sslCertificateKey("/etc/nginx/ssl/example.com.key")
  .sslSessionCache("shared:SSL:10m")
  .sslSessionTimeout("10m")
  .sslProtocols("TLSv1.2", "TLSv1.3")
  .sslPreferServerCiphers(true)
  .sslCiphers("HIGH:!aNULL:!MD5");

server
  .addLocation("/")
  .root("/var/www/html")
  .index("index.html")
  .addHeader("X-Frame-Options", "DENY")
  .addHeader("X-Content-Type-Options", "nosniff")
  .addHeader("X-XSS-Protection", "1; mode=block")
  .addHeader("Referrer-Policy", "strict-origin-when-cross-origin")
  .addHeader("Content-Security-Policy", "default-src 'self'");

server.addLocation("/api/public").enableCors({
  origins: ["https://trusted-site.com"],
  methods: ["GET", "POST", "OPTIONS"],
  headers: ["Authorization", "Content-Type"],
  credentials: true,
  maxAge: 3600,
});

console.log(config.build());
