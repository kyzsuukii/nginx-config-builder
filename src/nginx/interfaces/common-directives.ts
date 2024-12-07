export interface CommonDirectives {
  accessLog?: { path: string; format?: string } | "off";
  errorLog?: { path: string; level?: string };
  clientMaxBodySize?: string;
  sendTimeout?: string;
  sendfile?: boolean;
  tcp_nopush?: boolean;
  tcp_nodelay?: boolean;
  keepaliveTimeout?: number;
  keepaliveRequests?: number;
  resetTimedoutConnection?: boolean;
  serverTokens?: boolean;
  hideNginxVersion?: boolean;
  expires?: string | "off";
}

export interface CompressionOptions {
  enable?: boolean;
  minLength?: string;
  types?: string[];
  proxied?:
    | "off"
    | "expired"
    | "no-cache"
    | "no-store"
    | "private"
    | "no_last_modified"
    | "no_etag"
    | "auth"
    | "any";
  vary?: boolean;
  level?: number;
  buffers?: { number: number; size: string };
}

export interface CacheOptions {
  path?: string;
  maxSize?: string;
  inactiveTime?: string;
  validTime?: string;
  useStale?: (
    | "error"
    | "timeout"
    | "invalid_header"
    | "updating"
    | "http_500"
    | "http_503"
  )[];
  key?: string;
}
