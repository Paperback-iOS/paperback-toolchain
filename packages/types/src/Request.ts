export interface Request {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: ArrayBuffer | object | string;
  cookies?: Record<string, string>;
}
