import { handleCommonResponse } from '@/bot/common'
import axios from 'axios'
import 'dotenv/config'

const instance = axios.create({
    baseURL: `${process.env.API_URL}/tgsolbot`,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const get = <Data extends JSONObject>(url: string, params?: any) => {
    return instance.get<Data>(url, { params }).then(handleCommonResponse)
}
export const post = <Data extends JSONObject>(url: string, data?: any) => {
    return instance.post<Data>(url, data).then(handleCommonResponse)
}
