import { SiteConfig } from "../src";

const basicSite = new SiteConfig({
  includes: ["/etc/nginx/mime.types", "/etc/nginx/fastcgi_params"],
  defaultServer: {
    port: 80,
    serverName: ["example.com", "www.example.com"],
    root: "/var/www/example",
    index: ["index.html", "index.htm"],
  },
});

basicSite
  .addServer(80)
  .serverName("static.example.com")
  .root("/var/www/static")
  .addLocation("~ \\.(jpg|jpeg|png|gif|ico|css|js)$")
  .expires("30d")
  .addHeader("Cache-Control", "public, no-transform");

console.log(basicSite.build());
