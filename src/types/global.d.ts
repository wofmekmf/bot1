type JSONValue = string | number | boolean | null | JSONObject | JSONArray
type JSONObject = { [key: string]: JSONValue }
type JSONArray = JSONValue[]
type Attrs<O> = { [K in keyof O as O[K] extends Function ? never : K]: O[K] }

type TokenMeta = {
    mint: string
    symbol: string
    name: string
    decimals: number
    logoURI: string
    coingeckoId: string
    whitelisted: boolean
    poolToken: boolean
}
type Err = { errno: number; errmsg: string }
