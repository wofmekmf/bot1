import { StatelessQuestion } from '@grammyjs/stateless-question'
import { clearAndNotice, handleCommonError } from '@/bot/common'
import { BotContext } from '@/bot/context'
import { get, post } from '@/lib/http'

export const transferQuestion3 = new StatelessQuestion<BotContext>('transfer_question_3', async ctx => {
    const text = ctx.message.text?.trim() ?? ''
    const n = parseFloat(text)
    if (Number.isNaN(n) || n <= 0) {
        const text = 'Please use a valid amount.'
        await clearAndNotice(ctx, text)
        return
    }
    const chat_id = ctx.chat?.id
    const token_address = ctx.session.transfer.token_address
    const wallet_address = ctx.session.transfer.wallet_address
    let decimals = 9
    if (token_address !== 'SOL') {
        const { data } = await get<{ data: TokenMeta | Err }>('/token', { token: text })
        if ('errno' in data) {
            ctx.reply(data.errmsg)
            return
        }
        decimals = data.decimals
    }
    const amount = n * Math.pow(10, decimals)
    const response = await post<{ data: { tx: string } }>('/transfer', {
        uid: chat_id,
        amount,
        token: token_address === 'SOL' ? undefined : token_address,
        to: wallet_address,
    }).catch(handleCommonError(ctx))
    const tx = response.data.tx
    const messageText = `
✅ Transfer successful!
View [Transaction hash](https://solscan.io/tx/${tx}).`
    await ctx.reply(messageText, { disable_web_page_preview: true, parse_mode: 'Markdown' })
})
