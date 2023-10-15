import { StatelessQuestion } from '@grammyjs/stateless-question'
import { clearAndNotice } from '@/bot/common'
import { BotContext } from '@/bot/context'
import { REGEX_TOKEN_ADDR } from '@/lib/constants'
import { get } from '@/lib/http'
import { transferQuestion2 } from '@/questions/transfer_question_2'

export const transferQuestion = new StatelessQuestion<BotContext>('transfer_question', async ctx => {
    const text = ctx.message.text?.trim() ?? ''
    if (!text || (!REGEX_TOKEN_ADDR.test(text) && text !== 'SOL')) {
        const msg = 'Please use a valid token address.'
        await clearAndNotice(ctx, msg)
        return
    }
    if (text !== 'SOL') {
        const { data } = await get<{ data: TokenMeta | Err }>('/token', { token: text })
        if ('errno' in data) {
            ctx.reply(data.errmsg)
            return
        } else {
            ctx.session.transfer.decimals = data.decimals
        }
    }
    ctx.session.transfer.token_address = text
    await transferQuestion2.replyWithMarkdown(ctx, 'Please enter the wallet address you want to transfer to.')
})
