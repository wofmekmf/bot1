import { assignNonUndefined, tryParseObject } from '@/lib/helper'

export class BaseSession {
    chat_id = 0
    message_id = 0
    constructor(attrs?: Partial<Attrs<BaseSession>>) {
        attrs && Object.assign(this, attrs)
    }
    toJSON() {
        return this
    }
    updateFromJSON(json: any) {
        if (typeof json === 'string') {
            json = tryParseObject(json, {})
        }
        assignNonUndefined(this, json)
        return this
    }
    reset() {
        Object.assign(this, new BaseSession())
    }
}
