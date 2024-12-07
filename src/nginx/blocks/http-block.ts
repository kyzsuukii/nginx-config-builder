import { Block } from "./block";
import { ServerBlock } from "./server-block";
import { UpstreamBlock } from "./upstream-block";
import { MapBlock } from "./map-block";

/**
 * Interface for typed directives in the HTTP block.
 * These directives can be applied using applyTypedDirectives method.
 */
interface HttpTypedDirectives {
  /** Enable or disable sendfile */
  sendfile?: boolean;
  /** Timeout for keep-alive connections */
  keepalive_timeout?: number;
  /** Maximum allowed size of the client request body */
  client_max_body_size?: string;
  /** Default MIME type for response */
  default_type?: string;
  /** Enable or disable gzip compression */
  gzip?: boolean;
  /** MIME types to apply gzip compression */
  gzip_types?: string[];
  /** Enable or disable TCP NOPUSH option */
  tcp_nopush?: boolean;
  /** Enable or disable TCP NODELAY option */
  tcp_nodelay?: boolean;
}

/**
 * Represents the HTTP block in Nginx configuration.
 * This block handles all HTTP-related configurations including servers,
 * upstreams, maps, and various HTTP-specific directives.
 */
export class HttpBlock extends Block {
  private servers: ServerBlock[] = [];
  private upstreams: UpstreamBlock[] = [];
  private maps: MapBlock[] = [];
  private typedDirectives: HttpTypedDirectives = {};

  // Basic Settings
  /**
   * Sets the timeout for keep-alive connections with optional header timeout.
   * @param seconds - Timeout in seconds for keep-alive connections
   * @param headerTimeout - Optional timeout for the keep-alive header
   * @returns this - For method chaining
   */
  keepaliveTimeout(seconds: number, headerTimeout?: number): this {
    if (headerTimeout !== undefined) {
      this.addDirective(`keepalive_timeout ${seconds} ${headerTimeout}`);
    } else {
      this.addDirective(`keepalive_timeout ${seconds}`);
    }
    return this;
  }

  /**
   * Enables or disables sendfile optimization.
   * @param on - If true, enables sendfile, if false, disables it
   * @returns this - For method chaining
   */
  sendfile(on: boolean): this {
    this.addDirective(`sendfile ${on ? "on" : "off"}`);
    return this;
  }

  /**
   * Enables or disables TCP NOPUSH option.
   * @param on - If true, enables tcp_nopush, if false, disables it
   * @returns this - For method chaining
   */
  tcpNopush(on: boolean): this {
    this.addDirective(`tcp_nopush ${on ? "on" : "off"}`);
    return this;
  }

  /**
   * Enables or disables TCP NODELAY option.
   * @param on - If true, enables tcp_nodelay, if false, disables it
   * @returns this - For method chaining
   */
  tcpNodelay(on: boolean): this {
    this.addDirective(`tcp_nodelay ${on ? "on" : "off"}`);
    return this;
  }

  /**
   * Sets the default MIME type for responses.
   * @param type - The MIME type to use as default
   * @returns this - For method chaining
   */
  defaultType(type: string): this {
    this.addDirective(`default_type ${type}`);
    return this;
  }

  /**
   * Includes a file with MIME type definitions.
   * @param path - Path to the MIME types file
   * @returns this - For method chaining
   */
  types(path: string): this {
    this.addDirective(`types { include ${path}; }`);
    return this;
  }

  /**
   * Sets the maximum allowed size of the client request body.
   * @param size - Maximum size (e.g., "10m" for 10 megabytes)
   * @returns this - For method chaining
   */
  clientMaxBodySize(size: string): this {
    this.addDirective(`client_max_body_size ${size}`);
    return this;
  }

  /**
   * Sets the buffer size for reading client request body.
   * @param size - Buffer size (e.g., "8k" for 8 kilobytes)
   * @returns this - For method chaining
   */
  clientBodyBufferSize(size: string): this {
    this.addDirective(`client_body_buffer_size ${size}`);
    return this;
  }

  /**
   * Sets timeout for reading client request body.
   * @param time - Timeout in seconds
   * @returns this - For method chaining
   */
  clientBodyTimeout(time: number): this {
    this.addDirective(`client_body_timeout ${time}`);
    return this;
  }

  /**
   * Sets timeout for reading client request header.
   * @param time - Timeout in seconds
   * @returns this - For method chaining
   */
  clientHeaderTimeout(time: number): this {
    this.addDirective(`client_header_timeout ${time}`);
    return this;
  }

  /**
   * Sets timeout for transmitting response to client.
   * @param time - Timeout in seconds
   * @returns this - For method chaining
   */
  sendTimeout(time: number): this {
    this.addDirective(`send_timeout ${time}`);
    return this;
  }

  /**
   * Sets buffer size for reading client request header.
   * @param size - Buffer size (e.g., "1k" for 1 kilobyte)
   * @returns this - For method chaining
   */
  clientHeaderBufferSize(size: string): this {
    this.addDirective(`client_header_buffer_size ${size}`);
    return this;
  }

  /**
   * Sets the number and size of buffers for reading large client request header.
   * @param number - Number of buffers
   * @param size - Size of each buffer
   * @returns this - For method chaining
   */
  largeClientHeaderBuffers(number: number, size: string): this {
    this.addDirective(`large_client_header_buffers ${number} ${size}`);
    return this;
  }

  /**
   * Enables or disables gzip compression.
   * @param on - If true, enables gzip, if false, disables it
   * @returns this - For method chaining
   */
  gzip(on: boolean): this {
    this.addDirective(`gzip ${on ? "on" : "off"}`);
    return this;
  }

  /**
   * Sets MIME types for which gzip compression should be enabled.
   * @param types - Array of MIME types
   * @returns this - For method chaining
   */
  gzipTypes(types: string[]): this {
    this.addDirective(`gzip_types ${types.join(" ")}`);
    return this;
  }

  /**
   * Sets minimum length of response that will be gzipped.
   * @param length - Minimum length (e.g., "1000")
   * @returns this - For method chaining
   */
  gzipMinLength(length: string): this {
    this.addDirective(`gzip_min_length ${length}`);
    return this;
  }

  /**
   * Sets gzip behavior for proxied requests.
   * @param option - Proxied request handling option
   * @returns this - For method chaining
   */
  gzipProxied(option: string): this {
    this.addDirective(`gzip_proxied ${option}`);
    return this;
  }

  /**
   * Sets gzip compression level.
   * @param level - Compression level (1-9)
   * @returns this - For method chaining
   */
  gzipComp(level: number): this {
    this.addDirective(`gzip_comp_level ${level}`);
    return this;
  }

  /**
   * Enables or disables inserting Vary: Accept-Encoding response header.
   * @param on - If true, enables Vary header, if false, disables it
   * @returns this - For method chaining
   */
  gzipVary(on: boolean): this {
    this.addDirective(`gzip_vary ${on ? "on" : "off"}`);
    return this;
  }

  /**
   * Configures SSL session cache.
   * @param type - Cache type
   * @param args - Additional cache arguments
   * @returns this - For method chaining
   */
  sslSessionCache(type: string, ...args: string[]): this {
    this.addDirective(`ssl_session_cache ${type} ${args.join(" ")}`);
    return this;
  }

  /**
   * Sets SSL session timeout.
   * @param time - Timeout duration (e.g., "10m" for 10 minutes)
   * @returns this - For method chaining
   */
  sslSessionTimeout(time: string): this {
    this.addDirective(`ssl_session_timeout ${time}`);
    return this;
  }

  /**
   * Configures access log.
   * @param path - Path to log file
   * @param format - Optional log format name
   * @returns this - For method chaining
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
   * Configures error log.
   * @param path - Path to log file
   * @param level - Optional log level
   * @returns this - For method chaining
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
   * Includes another configuration file.
   * @param path - Path to configuration file
   * @returns this - For method chaining
   */
  include(path: string): this {
    this.addDirective(`include ${path}`);
    return this;
  }

  /**
   * Defines a log format.
   * @param name - Name of the log format
   * @param format - Format string
   * @returns this - For method chaining
   */
  logFormat(name: string, format: string): this {
    this.addDirective(`log_format ${name} '${format}'`);
    return this;
  }

  /**
   * Applies multiple typed directives at once.
   * @param d - Object containing typed directives
   * @returns this - For method chaining
   */
  applyTypedDirectives(d: Partial<HttpTypedDirectives>): this {
    Object.assign(this.typedDirectives, d);
    return this;
  }

  /**
   * Adds a new server block to the configuration.
   * @param portOrUnix - Port number or Unix socket path
   * @param ssl - Whether to enable SSL
   * @returns The created server block
   */
  addServer(portOrUnix: number | string, ssl: boolean = false): ServerBlock {
    const srv = new ServerBlock().listen(portOrUnix, ssl);
    this.servers.push(srv);
    return srv;
  }

  /**
   * Adds a new upstream block to the configuration.
   * @param name - Name of the upstream
   * @returns The created upstream block
   */
  addUpstream(name: string): UpstreamBlock {
    const up = new UpstreamBlock(name);
    this.upstreams.push(up);
    return up;
  }

  /**
   * Adds a new map block to the configuration.
   * @param variable - Source variable
   * @param outputVar - Output variable
   * @returns The created map block
   */
  addMap(variable: string, outputVar: string): MapBlock {
    const map = new MapBlock(variable, outputVar);
    this.maps.push(map);
    return map;
  }

  /**
   * Builds the typed directives into configuration lines.
   * @returns Array of directive strings
   * @private
   */
  private buildTypedDirectives(): string[] {
    const lines: string[] = [];
    if (this.typedDirectives.sendfile !== undefined) {
      lines.push(`sendfile ${this.typedDirectives.sendfile ? "on" : "off"};`);
    }
    if (typeof this.typedDirectives.keepalive_timeout === "number") {
      lines.push(
        `keepalive_timeout ${this.typedDirectives.keepalive_timeout};`
      );
    }
    if (this.typedDirectives.client_max_body_size) {
      lines.push(
        `client_max_body_size ${this.typedDirectives.client_max_body_size};`
      );
    }
    if (this.typedDirectives.default_type) {
      lines.push(`default_type ${this.typedDirectives.default_type};`);
    }
    if (this.typedDirectives.gzip !== undefined) {
      lines.push(`gzip ${this.typedDirectives.gzip ? "on" : "off"};`);
    }
    if (
      this.typedDirectives.gzip_types &&
      this.typedDirectives.gzip_types.length > 0
    ) {
      lines.push(`gzip_types ${this.typedDirectives.gzip_types.join(" ")};`);
    }
    if (this.typedDirectives.tcp_nopush !== undefined) {
      lines.push(
        `tcp_nopush ${this.typedDirectives.tcp_nopush ? "on" : "off"};`
      );
    }
    if (this.typedDirectives.tcp_nodelay !== undefined) {
      lines.push(
        `tcp_nodelay ${this.typedDirectives.tcp_nodelay ? "on" : "off"};`
      );
    }
    return lines;
  }

  /**
   * Builds the complete HTTP block configuration.
   * @param indent - Indentation string
   * @returns The formatted HTTP block configuration
   */
  build(indent = ""): string {
    const blockIndent = indent + "    ";
    const typed = this.buildTypedDirectives()
      .map((d) => blockIndent + d)
      .join("\n");
    const blockDirectives = this.directives
      .map((d) => blockIndent + d)
      .join("\n");
    const upstreams = this.upstreams
      .map((u) => u.build(blockIndent))
      .join("\n\n");
    const maps = this.maps.map((m) => m.build(blockIndent)).join("\n\n");
    const servers = this.servers.map((s) => s.build(blockIndent)).join("\n\n");

    const parts = [typed, blockDirectives, upstreams, maps, servers]
      .filter((part) => part.trim())
      .join("\n\n");

    return parts.trim()
      ? `${indent}http {\n${parts}\n${indent}}`
      : `${indent}http {}`;
  }
}
