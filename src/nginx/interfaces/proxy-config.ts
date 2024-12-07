export interface ProxyConfig {
  upstream: string;
  headers?: {
    host?: string;
    realIp?: boolean;
    forwardedFor?: boolean;
    forwardedProto?: boolean;
    forwardedHost?: boolean;
    forwardedPort?: boolean;
    [key: string]: string | boolean | undefined;
  };
  timeouts?: {
    read?: string | number;
    connect?: string | number;
    send?: string | number;
  };
  buffering?: {
    enabled?: boolean;
    buffers?: {
      number: number;
      size: string;
    };
  };
  websocket?: boolean;
  redirect?: {
    from: string;
    to: string;
  };
  nextUpstream?: {
    timeout?: number;
    tries?: number;
    cases?: (
      | "error"
      | "timeout"
      | "invalid_header"
      | "http_500"
      | "http_502"
      | "http_503"
      | "http_504"
      | "non_idempotent"
    )[];
  };
}
