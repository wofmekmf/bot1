import BigNumber from 'bignumber.js'

export const tryParseObject = <T extends object>(jsonString: string, fallback?: null | T | (() => T)) => {
    let result: T | null = null
    if (fallback === undefined) {
        fallback = null
    }
    try {
        result = JSON.parse(jsonString)
    } catch (e) {
        result = null
    }
    if (result === null) {
        result = typeof fallback === 'function' ? fallback() : fallback
    }
    return result
}
export const assignNonUndefined = <T extends object>(target: T, source: Partial<T>) => {
    for (const key in source) {
        const value = source[key]
        if (value !== undefined) {
            if (target[key] instanceof BigNumber) {
                // @ts-ignore
                target[key] = new BigNumber(value)
            } else {
                target[key] = value
            }
        }
    }
}
