import { SiteConfig } from "../src";

const phpSite = new SiteConfig();

const phpServer = phpSite
  .addServer(80)
  .serverName("php.example.com")
  .root("/var/www/php")
  .index("index.php", "index.html");

phpServer
  .addLocation("~ \\.php$")
  .fastcgiPass("unix:/var/run/php/php8.1-fpm.sock")
  .fastcgiIndex("index.php")
  .includeTypedDirective("fastcgi_params")
  .fastcgiParam("SCRIPT_FILENAME", "$document_root$fastcgi_script_name");

console.log(phpSite.build());
