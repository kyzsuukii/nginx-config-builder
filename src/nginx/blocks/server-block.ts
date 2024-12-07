import { Block } from "./block";
import { LocationBlock } from "./location-block";

/**
 * Class representing an Nginx server block configuration
 * @extends Block
 */
export class ServerBlock extends Block {
  private locations: LocationBlock[] = [];

  /**
   * Configures the listening port or Unix domain socket for the server
   * @param portOrUnix - Port number or Unix domain socket path
   * @param ssl - Whether to enable SSL for this port
   * @returns The current ServerBlock instance for method chaining
   */
  listen(portOrUnix: number | string, ssl: boolean = false): this {
    if (typeof portOrUnix === "number") {
      this.addDirective(`listen ${portOrUnix}${ssl ? " ssl" : ""}`);
    } else {
      this.addDirective(`listen ${portOrUnix}${ssl ? " ssl" : ""}`);
    }
    return this;
  }

  /**
   * Sets server names (domain names) that this server block should respond to
   * @param names - One or more domain names
   * @returns The current ServerBlock instance for method chaining
   */
  serverName(...names: string[]): this {
    this.addDirective(`server_name ${names.join(" ")}`);
    return this;
  }

  /**
   * Sets the root directory for requests
   * @param path - Path to the root directory
   * @returns The current ServerBlock instance for method chaining
   */
  root(path: string): this {
    this.addDirective(`root ${path}`);
    return this;
  }

  /**
   * Sets the index files to try when serving a directory
   * @param files - One or more index filenames
   * @returns The current ServerBlock instance for method chaining
   */
  index(...files: string[]): this {
    this.addDirective(`index ${files.join(" ")}`);
    return this;
  }

  /**
   * Sets the SSL certificate file path
   * @param path - Path to the SSL certificate file
   * @returns The current ServerBlock instance for method chaining
   */
  sslCertificate(path: string): this {
    this.addDirective(`ssl_certificate ${path}`);
    return this;
  }

  /**
   * Sets the SSL certificate key file path
   * @param path - Path to the SSL certificate key file
   * @returns The current ServerBlock instance for method chaining
   */
  sslCertificateKey(path: string): this {
    this.addDirective(`ssl_certificate_key ${path}`);
    return this;
  }

  /**
   * Sets the enabled SSL ciphers
   * @param ciphers - String of SSL ciphers
   * @returns The current ServerBlock instance for method chaining
   */
  sslCiphers(ciphers: string): this {
    this.addDirective(`ssl_ciphers ${ciphers}`);
    return this;
  }

  /**
   * Sets the enabled SSL protocols
   * @param protocols - List of SSL protocols
   * @returns The current ServerBlock instance for method chaining
   */
  sslProtocols(...protocols: string[]): this {
    this.addDirective(`ssl_protocols ${protocols.join(" ")}`);
    return this;
  }

  /**
   * Sets whether to prefer server ciphers over client ciphers
   * @param on - True to prefer server ciphers, false otherwise
   * @returns The current ServerBlock instance for method chaining
   */
  sslPreferServerCiphers(on: boolean): this {
    this.addDirective(`ssl_prefer_server_ciphers ${on ? "on" : "off"}`);
    return this;
  }

  /**
   * Configures the SSL session cache
   * @param value - SSL session cache configuration string
   * @returns The current ServerBlock instance for method chaining
   */
  sslSessionCache(value: string): this {
    this.addDirective(`ssl_session_cache ${value}`);
    return this;
  }

  /**
   * Sets the SSL session timeout
   * @param value - SSL session timeout value
   * @returns The current ServerBlock instance for method chaining
   */
  sslSessionTimeout(value: string): this {
    this.addDirective(`ssl_session_timeout ${value}`);
    return this;
  }

  /**
   * Sets the path to the Diffie-Hellman parameters file
   * @param path - Path to the DH parameters file
   * @returns The current ServerBlock instance for method chaining
   */
  sslDhparam(path: string): this {
    this.addDirective(`ssl_dhparam ${path}`);
    return this;
  }

  /**
   * Adds allow/deny rules for access control
   * @param rules - List of allow/deny rules
   * @returns The current ServerBlock instance for method chaining
   */
  allowDeny(...rules: string[]): this {
    rules.forEach((rule) => this.addDirective(rule));
    return this;
  }

  /**
   * Sets up basic authentication with a realm
   * @param realm - Authentication realm name
   * @returns The current ServerBlock instance for method chaining
   */
  auth_basic(realm: string): this {
    this.addDirective(`auth_basic "${realm}"`);
    return this;
  }

  /**
   * Sets the path to the basic auth user file
   * @param file - Path to the user file
   * @returns The current ServerBlock instance for method chaining
   */
  auth_basic_user_file(file: string): this {
    this.addDirective(`auth_basic_user_file ${file}`);
    return this;
  }

  /**
   * Configures access log settings
   * @param path - Path to the access log file
   * @param format - Optional log format string
   * @returns The current ServerBlock instance for method chaining
   */
  accessLog(path: string, format?: string): this {
    if (format) {
      this.addDirective(`access_log ${path} ${format}`);
    } else {
      this.addDirective(`access_log ${path}`);
    }
    return this;
  }

  /**
   * Configures error log settings
   * @param path - Path to the error log file
   * @param level - Optional log level
   * @returns The current ServerBlock instance for method chaining
   */
  errorLog(path: string, level?: string): this {
    if (level) {
      this.addDirective(`error_log ${path} ${level}`);
    } else {
      this.addDirective(`error_log ${path}`);
    }
    return this;
  }

  /**
   * Configures custom error pages
   * @param code - HTTP error code or array of codes
   * @param uri - URI to redirect to for the specified error code(s)
   * @returns The current ServerBlock instance for method chaining
   */
  errorPage(code: number | number[], uri: string): this {
    const codes = Array.isArray(code) ? code.join(" ") : code;
    this.addDirective(`error_page ${codes} ${uri}`);
    return this;
  }

  /**
   * Sets the maximum allowed size of the client request body
   * @param size - Maximum size (e.g., "10m" for 10 megabytes)
   * @returns The current ServerBlock instance for method chaining
   */
  clientMaxBodySize(size: string): this {
    this.addDirective(`client_max_body_size ${size}`);
    return this;
  }

  /**
   * Configures a URL redirection
   * @param code - HTTP status code for the redirect
   * @param url - URL to redirect to
   * @returns The current ServerBlock instance for method chaining
   */
  returnDirective(code: number, url: string): this {
    this.addDirective(`return ${code} ${url}`);
    return this;
  }

  /**
   * Configures try_files directive to check for file existence in order
   * @param files - List of files or locations to try
   * @returns The current ServerBlock instance for method chaining
   */
  tryFiles(...files: string[]): this {
    this.addDirective(`try_files ${files.join(" ")}`);
    return this;
  }

  /**
   * Adds a URL rewrite rule
   * @param regex - Regular expression to match the URL
   * @param replacement - Replacement URL
   * @param flag - Optional rewrite flag (last, break, redirect, permanent)
   * @returns The current ServerBlock instance for method chaining
   */
  rewrite(regex: string, replacement: string, flag?: string): this {
    this.addDirective(
      `rewrite ${regex} ${replacement}${flag ? ` ${flag}` : ""}`
    );
    return this;
  }

  /**
   * Adds a location block to the server configuration
   * @param path - URL path for the location block
   * @param exact - Whether the path should be matched exactly
   * @returns The created LocationBlock instance
   */
  addLocation(path: string, exact: boolean = false): LocationBlock {
    const location = new LocationBlock(path, exact);
    this.locations.push(location);
    return location;
  }

  /**
   * Builds the complete server block configuration string
   * @param indent - Initial indentation level
   * @returns Formatted server block configuration string
   */
  build(indent = ""): string {
    const blockIndent = indent + "    ";
    const directives = this.formatDirectives(blockIndent);
    const locations = this.locations
      .map((loc) => loc.build(blockIndent))
      .join("\n\n");

    return `${indent}server {\n${directives}${
      locations ? "\n\n" + locations : ""
    }\n${indent}}`;
  }
}
