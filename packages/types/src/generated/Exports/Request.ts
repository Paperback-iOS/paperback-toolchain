export interface Request {
    url: string
    method: string
    headers?: Record<string, string>
    body?: ArrayBuffer | Object | String
    cookies?: Record<string, string>
}