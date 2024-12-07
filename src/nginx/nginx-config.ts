import { EventsBlock } from "./blocks/events-block";
import { HttpBlock } from "./blocks/http-block";

interface NginxConfigDefaults {
  user?: string;
  workerProcesses?: string | number;
  pid?: string;
  events?: {
    workerConnections?: number;
    multiAccept?: boolean;
  };
  http?: {
    include?: string[];
    logFormat?: { name: string; format: string };
    sendfile?: boolean;
    keepalive_timeout?: number;
    client_max_body_size?: string;
    default_type?: string;
    gzip?: boolean;
    gzip_types?: string[];
  };
}

export class NginxConfig {
  private userDirective?: string;
  private workerProcessesDirective?: string;
  private pidDirective?: string;
  private eventsBlock?: EventsBlock;
  private httpBlock?: HttpBlock;

  constructor(defaults?: NginxConfigDefaults) {
    if (defaults?.user) this.user(defaults.user);
    if (defaults?.workerProcesses !== undefined)
      this.workerProcesses(defaults.workerProcesses);
    if (defaults?.pid) this.pid(defaults.pid);

    if (defaults?.events) {
      const ev = this.events();
      if (typeof defaults.events.workerConnections === "number") {
        ev.workerConnections(defaults.events.workerConnections);
      }
      if (typeof defaults.events.multiAccept === "boolean") {
        ev.multiAccept(defaults.events.multiAccept);
      }
    }

    if (defaults?.http) {
      const h = this.http();
      if (defaults.http.include) {
        defaults.http.include.forEach((path) => h.include(path));
      }
      if (defaults.http.logFormat) {
        h.logFormat(
          defaults.http.logFormat.name,
          defaults.http.logFormat.format
        );
      }
      h.applyTypedDirectives({
        sendfile: defaults.http.sendfile,
        keepalive_timeout: defaults.http.keepalive_timeout,
        client_max_body_size: defaults.http.client_max_body_size,
        default_type: defaults.http.default_type,
        gzip: defaults.http.gzip,
        gzip_types: defaults.http.gzip_types,
      });
    }
  }

  /**
   * Sets the nginx worker user.
   * @param user - Username for worker processes
   */
  user(user: string): this {
    this.userDirective = `user ${user};`;
    return this;
  }

  /**
   * Sets the number of worker processes.
   * @param val - Number or "auto" for worker processes
   */
  workerProcesses(val: string | number): this {
    this.workerProcessesDirective = `worker_processes ${val};`;
    return this;
  }

  /**
   * Sets the path for the PID file.
   * @param path - File path for the PID file
   */
  pid(path: string): this {
    this.pidDirective = `pid ${path};`;
    return this;
  }

  /**
   * Gets or creates the events configuration block.
   * @returns EventsBlock instance for configuration
   */
  events(): EventsBlock {
    if (!this.eventsBlock) this.eventsBlock = new EventsBlock();
    return this.eventsBlock;
  }

  /**
   * Gets or creates the HTTP configuration block.
   * @returns HttpBlock instance for configuration
   */
  http(): HttpBlock {
    if (!this.httpBlock) this.httpBlock = new HttpBlock();
    return this.httpBlock;
  }

  /**
   * Builds the complete nginx configuration.
   * @returns Complete nginx configuration as string
   */
  build(): string {
    const parts: string[] = [];

    if (this.userDirective) parts.push(this.userDirective);
    if (this.workerProcessesDirective)
      parts.push(this.workerProcessesDirective);
    if (this.pidDirective) parts.push(this.pidDirective);

    if (this.eventsBlock) parts.push(this.eventsBlock.build());
    if (this.httpBlock) parts.push(this.httpBlock.build());

    return parts.join("\n\n") + "\n";
  }
}
