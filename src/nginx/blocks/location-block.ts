import { Block } from "./block";
import { IfBlock } from "./if-block";

/**
 * Represents a location block in Nginx configuration.
 * Location blocks define how Nginx processes requests for different URL patterns.
 * @extends Blocks
 */
export class LocationBlock extends Block {
  private path: string;
  private exact: boolean;
  private ifBlocks: IfBlock[] = [];

  /**
   * Creates a new location block.
   * @param path - URL pattern for this location
   * @param exact - If true, requires an exact match for the URL
   */
  constructor(path: string, exact: boolean = false) {
    super();
    this.path = path;
    this.exact = exact;
  }

  /**
   * Sets the root directory for requests.
   * @param path - Path to the root directory
   * @returns this - For method chaining
   */
  root(path: string): this {
    this.addDirective(`root ${path}`);
    return this;
  }

  /**
   * Sets an alias for the location path.
   * @param path - Path to alias to
   * @returns this - For method chaining
   */
  alias(path: string): this {
    this.addDirective(`alias ${path}`);
    return this;
  }

  /**
   * Configures default index files.
   * @param files - List of index files to try
   * @returns this - For method chaining
   */
  index(...files: string[]): this {
    this.addDirective(`index ${files.join(" ")}`);
    return this;
  }

  /**
   * Sets allow/deny rules for the location.
   * @param rules - List of allow/deny rules (e.g., "allow 192.168.1.0/24", "deny all")
   * @returns this - For method chaining
   */
  allowDeny(...rules: string[]): this {
    rules.forEach((rule) => this.addDirective(rule));
    return this;
  }

  /**
   * Enables basic authentication with the specified realm.
   * @param realm - Authentication realm name
   * @returns this - For method chaining
   */
  auth_basic(realm: string): this {
    this.addDirective(`auth_basic "${realm}"`);
    return this;
  }

  /**
   * Sets the user file for basic authentication.
   * @param file - Path to the authentication user file
   * @returns this - For method chaining
   */
  auth_basic_user_file(file: string): this {
    this.addDirective(`auth_basic_user_file ${file}`);
    return this;
  }

  /**
   * Configures try_files directive for checking file existence.
   * @param files - List of files to try (last parameter can be a fallback URI)
   * @returns this - For method chaining
   */
  tryFiles(...files: string[]): this {
    this.addDirective(`try_files ${files.join(" ")}`);
    return this;
  }

  /**
   * Sets up reverse proxy to the specified URL.
   * @param url - Target URL to proxy requests to
   * @returns this - For method chaining
   */
  proxyPass(url: string): this {
    this.addDirective(`proxy_pass ${url}`);
    return this;
  }

  /**
   * Sets a proxy header.
   * @param header - Header name
   * @param value - Header value
   * @returns this - For method chaining
   */
  proxySetHeader(header: string, value: string): this {
    this.addDirective(`proxy_set_header ${header} ${value}`);
    return this;
  }

  /**
   * Enables or disables proxy buffering.
   * @param on - If true, enables buffering, if false, disables it
   * @returns this - For method chaining
   */
  proxyBuffering(on: boolean): this {
    this.addDirective(`proxy_buffering ${on ? "on" : "off"}`);
    return this;
  }

  /**
   * Sets the size of the proxy buffer.
   * @param size - Buffer size (e.g., "4k", "8k")
   * @returns this - For method chaining
   */
  proxyBufferSize(size: string): this {
    this.addDirective(`proxy_buffer_size ${size}`);
    return this;
  }

  /**
   * Sets the number and size of proxy buffers.
   * @param number - Number of buffers
   * @param size - Size of each buffer
   * @returns this - For method chaining
   */
  proxyBuffers(number: number, size: string): this {
    this.addDirective(`proxy_buffers ${number} ${size}`);
    return this;
  }

  /**
   * Sets the size of the busy buffers.
   * @param size - Buffer size (e.g., "8k", "16k")
   * @returns this - For method chaining
   */
  proxyBusyBuffersSize(size: string): this {
    this.addDirective(`proxy_busy_buffers_size ${size}`);
    return this;
  }

  /**
   * Sets the maximum size of the temporary file when buffering.
   * @param size - Maximum size (e.g., "1024m")
   * @returns this - For method chaining
   */
  proxyMaxTempFileSize(size: string): this {
    this.addDirective(`proxy_max_temp_file_size ${size}`);
    return this;
  }

  /**
   * Sets the timeout for reading a response from the proxied server.
   * @param timeout - Timeout value (e.g., "60s")
   * @returns this - For method chaining
   */
  proxyReadTimeout(timeout: string): this {
    this.addDirective(`proxy_read_timeout ${timeout}`);
    return this;
  }

  /**
   * Sets the timeout for establishing a connection with the proxied server.
   * @param timeout - Timeout value (e.g., "60s")
   * @returns this - For method chaining
   */
  proxyConnectTimeout(timeout: string): this {
    this.addDirective(`proxy_connect_timeout ${timeout}`);
    return this;
  }

  /**
   * Sets the timeout for transmitting a request to the proxied server.
   * @param timeout - Timeout value (e.g., "60s")
   * @returns this - For method chaining
   */
  proxySendTimeout(timeout: string): this {
    this.addDirective(`proxy_send_timeout ${timeout}`);
    return this;
  }

  /**
   * Configures URL redirection for proxied requests.
   * @param from - Original URL pattern
   * @param to - Target URL pattern
   * @returns this - For method chaining
   */
  proxyRedirect(from: string, to: string): this {
    this.addDirective(`proxy_redirect ${from} ${to}`);
    return this;
  }

  /**
   * Sets the FastCGI server address.
   * @param address - FastCGI server address (e.g., "unix:/var/run/php/php-fpm.sock")
   * @returns this - For method chaining
   */
  fastcgiPass(address: string): this {
    this.addDirective(`fastcgi_pass ${address}`);
    return this;
  }

  /**
   * Sets a FastCGI parameter.
   * @param param - Parameter name
   * @param value - Parameter value
   * @returns this - For method chaining
   */
  fastcgiParam(param: string, value: string): this {
    this.addDirective(`fastcgi_param ${param} ${value}`);
    return this;
  }

  /**
   * Sets the FastCGI index file.
   * @param index - Index filename
   * @returns this - For method chaining
   */
  fastcgiIndex(index: string): this {
    this.addDirective(`fastcgi_index ${index}`);
    return this;
  }

  /**
   * Adds a response header.
   * @param name - Header name
   * @param value - Header value
   * @returns this - For method chaining
   */
  addHeader(name: string, value: string): this {
    this.addDirective(`add_header ${name} ${value}`);
    return this;
  }

  /**
   * Configures CORS (Cross-Origin Resource Sharing) headers.
   * @param options - CORS configuration options
   * @param options.origins - Allowed origins (default: ["*"])
   * @param options.methods - Allowed HTTP methods (default: ["GET", "POST", "OPTIONS"])
   * @param options.headers - Allowed headers (default: common headers)
   * @param options.credentials - Allow credentials (default: false)
   * @param options.maxAge - Preflight cache duration in seconds (default: 1728000)
   * @returns this - For method chaining
   */
  enableCors(
    options: {
      origins?: string[];
      methods?: string[];
      headers?: string[];
      credentials?: boolean;
      maxAge?: number;
    } = {}
  ): this {
    const {
      origins = ["*"],
      methods = ["GET", "POST", "OPTIONS"],
      headers = ["DNT", "X-CustomHeader", "Keep-Alive", "User-Agent"],
      credentials = false,
      maxAge = 1728000,
    } = options;

    this.addHeader("Access-Control-Allow-Origin", origins.join(" "));
    this.addHeader("Access-Control-Allow-Methods", methods.join(" "));
    this.addHeader("Access-Control-Allow-Headers", headers.join(" "));
    if (credentials) {
      this.addHeader("Access-Control-Allow-Credentials", "true");
    }
    this.addHeader("Access-Control-Max-Age", maxAge.toString());

    return this;
  }

  /**
   * Sets the expiration time for responses.
   * @param time - Expiration time (e.g., "30d", "24h", "max")
   * @returns this - For method chaining
   */
  expires(time: string): this {
    this.addDirective(`expires ${time}`);
    return this;
  }

  /**
   * Creates a new if block with the specified condition.
   * @param condition - Condition for the if block
   * @returns The created if block
   */
  if(condition: string): IfBlock {
    const ifBlock = new IfBlock(condition);
    this.ifBlocks.push(ifBlock);
    return ifBlock;
  }

  /**
   * Includes a configuration file.
   * @param filename - Name of the file to include
   * @returns this - For method chaining
   */
  includeTypedDirective(filename: string): this {
    this.addDirective(`include ${filename}`);
    return this;
  }

  /**
   * Builds the location block configuration.
   * @param indent - Indentation string
   * @returns The formatted location block configuration
   */
  build(indent = ""): string {
    const blockIndent = indent + "    ";
    const prefix = this.exact ? "=" : "";
    const directives = this.formatDirectives(blockIndent);
    const ifs = this.ifBlocks.map((ifb) => ifb.build(blockIndent)).join("\n\n");

    return `${indent}location ${prefix} ${this.path} {\n${directives}${
      ifs ? "\n\n" + ifs : ""
    }\n${indent}}`;
  }
}
