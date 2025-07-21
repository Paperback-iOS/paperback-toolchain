export interface Cookie {
  name: string
  value: string
  domain: string
  path?: string
  created?: Date
  expires?: Date
}
