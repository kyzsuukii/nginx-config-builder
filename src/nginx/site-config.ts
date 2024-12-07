import { ServerBlock } from "./blocks/server-block";

/**
 * Interface for configuring default settings of a site configuration
 */
interface SiteConfigDefaults {
  /** Array of paths to include in the configuration */
  includes?: string[];
  /** Default server block configuration */
  defaultServer?: {
    /** Port number or Unix domain socket path to listen on */
    port: number | string;
    /** Whether to enable SSL for this server */
    ssl?: boolean;
    /** Array of server names (domain names) */
    serverName?: string[];
    /** Document root directory */
    root?: string;
    /** Default index files to serve */
    index?: string[];
  };
}

/**
 * Class representing an Nginx site configuration
 * Manages server blocks and global directives for a specific site
 */
export class SiteConfig {
  private directives: string[] = [];
  private servers: ServerBlock[] = [];

  /**
   * Creates a new site configuration
   * @param defaults - Optional default configuration settings
   */
  constructor(defaults?: SiteConfigDefaults) {
    if (defaults?.includes) {
      defaults.includes.forEach((inc) => this.include(inc));
    }
    if (defaults?.defaultServer) {
      const s = this.addServer(
        defaults.defaultServer.port,
        defaults.defaultServer.ssl
      );
      if (defaults.defaultServer.serverName) {
        s.serverName(...defaults.defaultServer.serverName);
      }
      if (defaults.defaultServer.root) s.root(defaults.defaultServer.root);
      if (defaults.defaultServer.index)
        s.index(...defaults.defaultServer.index);
    }
  }

  /**
   * Adds an include directive to the configuration
   * @param path - Path to the file to include
   * @returns The current SiteConfig instance for method chaining
   */
  include(path: string): this {
    this.directives.push(`include ${path};`);
    return this;
  }

  /**
   * Creates and adds a new server block to the configuration
   * @param portOrUnix - Port number or Unix domain socket path for the server to listen on
   * @param ssl - Whether to enable SSL for this server
   * @returns The created ServerBlock instance
   */
  addServer(portOrUnix: number | string, ssl: boolean = false): ServerBlock {
    const srv = new ServerBlock().listen(portOrUnix, ssl);
    this.servers.push(srv);
    return srv;
  }

  /**
   * Builds the complete site configuration string
   * @returns Formatted site configuration string with all directives and server blocks
   */
  build(): string {
    const directives = this.directives
      .map((d) => (d.endsWith(";") ? d : d + ";"))
      .join("\n");
    const servers = this.servers.map((s) => s.build()).join("\n");
    const parts = [directives, servers].filter(Boolean).join("\n");
    return parts + "\n";
  }
}
