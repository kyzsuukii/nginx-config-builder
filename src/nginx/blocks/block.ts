import {
  CommonDirectives,
  CompressionOptions,
  CacheOptions,
} from "../interfaces/common-directives";

export abstract class Block {
  protected directives: string[] = [];

  /**
   * Adds a directive statement to the block configuration.
   * Automatically appends a semicolon if one is not present.
   *
   * @param directive - The directive statement to add (e.g. "worker_connections 1024")
   * @returns this - For method chaining
   */
  addDirective(directive: string): this {
    if (!directive.endsWith(";")) {
      directive += ";";
    }
    this.directives.push(directive);
    return this;
  }

  /**
   * Formats all directives with proper indentation.
   *
   * @param indent - Indentation string to use (default: 4 spaces)
   * @returns Formatted string of directives
   */
  protected formatDirectives(indent: string = "    "): string {
    return this.directives.map((d) => indent + d).join("\n");
  }

  /**
   * Builds the complete string representation of this block.
   *
   * @param indent - Optional indentation level for the block
   * @returns Complete nginx configuration string for this block
   */
  abstract build(indent?: string): string;

  /**
   * Applies common Nginx directives to the block.
   * @param directives - Common directives configuration object
   * @returns this - For method chaining
   */
  applyCommonDirectives(directives: CommonDirectives): this {
    if (directives.accessLog) {
      if (directives.accessLog === "off") {
        this.addDirective("access_log off");
      } else {
        const format = directives.accessLog.format
          ? ` ${directives.accessLog.format}`
          : "";
        this.addDirective(`access_log ${directives.accessLog.path}${format}`);
      }
    }

    if (directives.errorLog) {
      const level = directives.errorLog.level
        ? ` ${directives.errorLog.level}`
        : "";
      this.addDirective(`error_log ${directives.errorLog.path}${level}`);
    }

    if (directives.clientMaxBodySize) {
      this.addDirective(`client_max_body_size ${directives.clientMaxBodySize}`);
    }

    if (directives.sendTimeout) {
      this.addDirective(`send_timeout ${directives.sendTimeout}`);
    }

    if (directives.sendfile !== undefined) {
      this.addDirective(`sendfile ${directives.sendfile ? "on" : "off"}`);
    }

    if (directives.tcp_nopush !== undefined) {
      this.addDirective(`tcp_nopush ${directives.tcp_nopush ? "on" : "off"}`);
    }

    if (directives.tcp_nodelay !== undefined) {
      this.addDirective(`tcp_nodelay ${directives.tcp_nodelay ? "on" : "off"}`);
    }

    return this;
  }

  /**
   * Configures Gzip compression settings for the block.
   * @param options - Compression configuration options
   * @returns this - For method chaining
   */
  configureCompression(options: CompressionOptions): this {
    if (options.enable !== undefined) {
      this.addDirective(`gzip ${options.enable ? "on" : "off"}`);
    }

    if (options.minLength) {
      this.addDirective(`gzip_min_length ${options.minLength}`);
    }

    if (options.types?.length) {
      this.addDirective(`gzip_types ${options.types.join(" ")}`);
    }

    if (options.proxied) {
      this.addDirective(`gzip_proxied ${options.proxied}`);
    }

    if (options.vary !== undefined) {
      this.addDirective(`gzip_vary ${options.vary ? "on" : "off"}`);
    }

    if (options.level !== undefined) {
      this.addDirective(`gzip_comp_level ${options.level}`);
    }

    if (options.buffers) {
      this.addDirective(
        `gzip_buffers ${options.buffers.number} ${options.buffers.size}`
      );
    }

    return this;
  }

  /**
   * Configures proxy caching settings for the block.
   * @param options - Cache configuration options
   * @returns this - For method chaining
   */
  configureCache(options: CacheOptions): this {
    if (options.path) {
      this.addDirective(
        `proxy_cache_path ${options.path}` +
          (options.maxSize ? ` max_size=${options.maxSize}` : "") +
          (options.inactiveTime ? ` inactive=${options.inactiveTime}` : "") +
          " keys_zone=my_cache:10m"
      );
    }

    if (options.validTime) {
      this.addDirective(`proxy_cache_valid ${options.validTime}`);
    }

    if (options.useStale?.length) {
      this.addDirective(`proxy_cache_use_stale ${options.useStale.join(" ")}`);
    }

    if (options.key) {
      this.addDirective(`proxy_cache_key ${options.key}`);
    }

    return this;
  }
}
