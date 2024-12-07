import { Block } from "./block";

/**
 * Represents the events block in an Nginx configuration.
 * This block is used to configure global settings that affect connection processing.
 */
export class EventsBlock extends Block {
  /**
   * Sets the maximum number of simultaneous connections that can be opened by a worker process.
   * @param num - The number of connections
   * @returns this - For method chaining
   */
  workerConnections(num: number): this {
    this.addDirective(`worker_connections ${num}`);
    return this;
  }

  /**
   * Enables or disables accepting multiple connections at a time.
   * @param on - If true, enables multi_accept, if false, disables it
   * @returns this - For method chaining
   */
  multiAccept(on: boolean): this {
    this.addDirective(`multi_accept ${on ? "on" : "off"}`);
    return this;
  }

  /**
   * Sets the connection processing method. Epoll is generally preferred on Linux systems.
   * @param on - If true, uses epoll, if false, uses poll
   * @returns this - For method chaining
   */
  useEpoll(on: boolean = true): this {
    this.addDirective(`use ${on ? "epoll" : "poll"}`);
    return this;
  }

  /**
   * Sets the maximum number of outstanding asynchronous I/O operations for a worker process.
   * @param num - The number of requests
   * @returns this - For method chaining
   */
  workerAioRequests(num: number): this {
    this.addDirective(`worker_aio_requests ${num}`);
    return this;
  }

  /**
   * Enables or disables the accept mutex, which serializes accept() calls between worker processes.
   * @param on - If true, enables accept_mutex, if false, disables it
   * @returns this - For method chaining
   */
  acceptMutex(on: boolean): this {
    this.addDirective(`accept_mutex ${on ? "on" : "off"}`);
    return this;
  }

  /**
   * Sets the maximum time during which a worker process will try to restart accepting new connections.
   * @param delay - The delay in milliseconds
   * @returns this - For method chaining
   */
  acceptMutexDelay(delay: number): this {
    this.addDirective(`accept_mutex_delay ${delay}ms`);
    return this;
  }

  /**
   * Enables debugging log for specific addresses.
   * @param address - The IP address or CIDR range to enable debugging for
   * @returns this - For method chaining
   */
  debugConnection(address: string): this {
    this.addDirective(`debug_connection ${address}`);
    return this;
  }

  /**
   * Builds the events block configuration string.
   * @returns The formatted events block configuration
   */
  build(): string {
    const directives = this.formatDirectives("    ");
    return `events {\n${directives}\n}`;
  }
}
