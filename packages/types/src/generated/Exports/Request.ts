import { Cookie } from "./../_exports"
export interface Request {
	url: string
	method: string
	headers?: Record<string, string>
	body?: ArrayBuffer | Object | String
	cookies?: Cookie[]
}