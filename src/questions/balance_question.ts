import { StatelessQuestion } from '@grammyjs/stateless-question'
import { clearAndNotice } from '@/bot/common'
import { BotContext } from '@/bot/context'
import { REGEX_TOKEN_ADDR } from '@/lib/constants'
import { get } from '@/lib/http'
import type { AxiosResponse } from 'axios'

export const balanceQuestion = new StatelessQuestion<BotContext>('balance_question', async ctx => {
    const text = ctx.message.text?.trim()
    if (!text || !REGEX_TOKEN_ADDR.test(text)) {
        const text = 'Please use a valid token address.'
        await clearAndNotice(ctx, text)
        return
    }
    const { data } = await get<{ data: TokenMeta | Err }>('/token', { token: text })
    if ('errno' in data) {
        ctx.reply(data.errmsg)
        return
    } 
    const chat_id = ctx.chat?.id
    const response = await get<{ data: { sol_balance: number; token: string; token_balance: number } }>('/balance', {
        uid: chat_id,
        token: text,
    }).catch(error => {
        const response = error.response as AxiosResponse<{ errno: number; errmsg: string }> | undefined
        if (response && [1005, 1006].includes(response.data.errno)) {
            ctx.reply(response.data.errmsg)
            throw error
        } else {
            return null
        }
    })
    const balance = response?.data.token_balance ?? 0
    const real_balance = balance;//balance / Math.pow(10, text === 'SOL' ? 9 : data.decimals)
    await ctx.reply(`Your Balance: ${real_balance} ${data.symbol}`, {
        disable_web_page_preview: true,
        parse_mode: 'Markdown',
    })
})
