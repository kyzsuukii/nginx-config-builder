import { Block } from "./block";

/**
 * Interface defining options for upstream server configuration
 */
interface ServerOptions {
  /** Weight of the server for load balancing (default: 1) */
  weight?: number;
  /** Maximum number of failed attempts before server is considered unavailable */
  maxFails?: number;
  /** How long the server should be considered unavailable */
  failTimeout?: string;
  /** Marks the server as a backup server */
  backup?: boolean;
  /** Marks the server as permanently unavailable */
  down?: boolean;
}

/**
 * Class representing an Nginx upstream block configuration
 * Used for defining groups of servers for load balancing and fault tolerance
 * @extends Block
 */
export class UpstreamBlock extends Block {
  /**
   * Creates a new upstream block
   * @param name - Name of the upstream block
   */
  constructor(private name: string) {
    super();
  }

  /**
   * Adds a server to the upstream group
   * @param address - Server address (IP:port or unix:/path)
   * @param options - Server configuration options
   * @returns The current UpstreamBlock instance for method chaining
   */
  server(address: string, options: ServerOptions = {}): this {
    const parts = [address];

    if (options.weight !== undefined) {
      parts.push(`weight=${options.weight}`);
    }
    if (options.maxFails !== undefined) {
      parts.push(`max_fails=${options.maxFails}`);
    }
    if (options.failTimeout) {
      parts.push(`fail_timeout=${options.failTimeout}`);
    }
    if (options.backup) {
      parts.push("backup");
    }
    if (options.down) {
      parts.push("down");
    }

    this.addDirective(`server ${parts.join(" ")}`);
    return this;
  }

  /**
   * Activates least connections load balancing method
   * Requests are distributed to the server with the least number of active connections
   * @returns The current UpstreamBlock instance for method chaining
   */
  leastConn(): this {
    this.addDirective("least_conn");
    return this;
  }

  /**
   * Activates IP hash load balancing method
   * Requests from the same IP address are passed to the same server
   * @returns The current UpstreamBlock instance for method chaining
   */
  ipHash(): this {
    this.addDirective("ip_hash");
    return this;
  }

  /**
   * Configures hash load balancing method
   * @param key - Hash key (can be text, variables, or their combination)
   * @param consistent - Whether to use consistent hashing
   * @returns The current UpstreamBlock instance for method chaining
   */
  hash(key: string, consistent: boolean = false): this {
    this.addDirective(`hash ${key}${consistent ? " consistent" : ""}`);
    return this;
  }

  /**
   * Activates random load balancing method
   * @param two - If true, picks two servers randomly and uses least_conn to choose between them
   * @returns The current UpstreamBlock instance for method chaining
   */
  random(two: boolean = false): this {
    this.addDirective(`random${two ? " two" : ""}`);
    return this;
  }

  /**
   * Sets the maximum number of idle keepalive connections
   * @param connections - Number of connections to keep alive
   * @returns The current UpstreamBlock instance for method chaining
   */
  keepalive(connections: number): this {
    this.addDirective(`keepalive ${connections}`);
    return this;
  }

  /**
   * Sets the maximum number of requests that can be served through one keepalive connection
   * @param number - Maximum number of requests
   * @returns The current UpstreamBlock instance for method chaining
   */
  keepaliveRequests(number: number): this {
    this.addDirective(`keepalive_requests ${number}`);
    return this;
  }

  /**
   * Sets a timeout during which a keepalive connection will stay open
   * @param timeout - Timeout in seconds
   * @returns The current UpstreamBlock instance for method chaining
   */
  keepaliveTimeout(timeout: number): this {
    this.addDirective(`keepalive_timeout ${timeout}`);
    return this;
  }

  /**
   * Configures queue for requests when all servers are busy
   * @param number - Maximum number of requests that can be queued
   * @param timeout - Optional timeout for queued requests
   * @returns The current UpstreamBlock instance for method chaining
   */
  queue(number: number, timeout?: string): this {
    const parts = [number.toString()];
    if (timeout) {
      parts.push(`timeout=${timeout}`);
    }
    this.addDirective(`queue ${parts.join(" ")}`);
    return this;
  }

  /**
   * Defines the name and size of the shared memory zone for the upstream group
   * @param name - Zone name
   * @param size - Zone size (e.g., "10m")
   * @returns The current UpstreamBlock instance for method chaining
   */
  zone(name: string, size: string): this {
    this.addDirective(`zone ${name} ${size}`);
    return this;
  }

  /**
   * Specifies a file that keeps the state of the dynamic upstream group
   * @param file - Path to the state file
   * @returns The current UpstreamBlock instance for method chaining
   */
  state(file: string): this {
    this.addDirective(`state ${file}`);
    return this;
  }

  /**
   * Sets the slow start time for a server
   * @param time - Time during which server's weight will gradually increase (e.g., "30s")
   * @returns The current UpstreamBlock instance for method chaining
   */
  slowStart(time: string): this {
    this.addDirective(`slow_start ${time}`);
    return this;
  }

  /**
   * Enables periodic DNS resolution for upstream servers
   * @returns The current UpstreamBlock instance for method chaining
   */
  resolve(): this {
    this.addDirective("resolve");
    return this;
  }

  /**
   * Builds the complete upstream block configuration string
   * @param indent - Initial indentation level
   * @returns Formatted upstream block configuration string
   */
  build(indent = ""): string {
    const blockIndent = indent + "    ";
    const directives = this.formatDirectives(blockIndent);
    return `${indent}upstream ${this.name} {\n${directives}\n${indent}}`;
  }
}
