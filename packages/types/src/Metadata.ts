export type JSONPrimitive = string | number | boolean | null
export type JSONObject = { [key: string]: JSONValue | undefined }
export type JSONArray = Array<JSONValue | undefined>
export type JSONValue = JSONPrimitive | JSONObject | JSONArray

export type Metadata = JSONValue
