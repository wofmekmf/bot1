import { Menu, MenuOptions } from '@grammyjs/menu'
import { BotContext } from '@/bot/context'
import type { AxiosResponse } from 'axios'

export const createMenu = (id: string, options?: MenuOptions<BotContext>) =>
    new Menu<BotContext>(id, { autoAnswer: false, onMenuOutdated: 'The menu is out dated!', ...options })

export async function clearAndNotice(ctx: BotContext, text: string) {
    if (ctx.message?.reply_to_message) {
        await ctx.api.deleteMessage(
            ctx.message?.reply_to_message?.chat.id ?? 0,
            ctx.message?.reply_to_message?.message_id ?? 0
        )
        await ctx.deleteMessage()
    }
    return await ctx.reply(text, { parse_mode: 'Markdown', disable_web_page_preview: true })
}

export const fingerprint = (ctx: BotContext): string => {
    return ctx.session.global.chat_id.toString()
}

export const handleCommonError = (ctx: BotContext) => (err: any) => {
    const response = err.response as AxiosResponse | undefined
    if (response?.data.errno) {
        ctx.reply(response.data.errmsg)
    } else {
        ctx.reply('Oops, something went wrong. Please try again later.')
    }
    throw err
}
export const handleCommonResponse = <Data extends object, Err extends { errno: number; errmsg: string }>(
    response: AxiosResponse<Data | Err>
) => {
    const result = response.data
    if ('errno' in result) {
        throw { response } as { response: { data: Err } }
    } else {
        return result as Data
    }
}
