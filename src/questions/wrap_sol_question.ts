import { StatelessQuestion } from '@grammyjs/stateless-question'
import { clearAndNotice, handleCommonError } from '@/bot/common'
import { BotContext } from '@/bot/context'
import { get, post } from '@/lib/http'
import { transferQuestion2 } from '@/questions/transfer_question_2'

export const wrapSolQuestion = new StatelessQuestion<BotContext>('wrap_sol_question', async ctx => {
    const text = ctx.message.text?.trim() ?? ''
    const n = parseFloat(text)
    if (Number.isNaN(n) || n <= 0) {
        const text = 'Please use a valid amount.'
        await clearAndNotice(ctx, text)
        return
    }
    const amount_in = n * Math.pow(10, 9)
    const chat_id = ctx.chat?.id ?? 0
    const response = await post<{ data: { tx: string } }>('/wrapsol', { uid: chat_id, amount_in }).catch(
        handleCommonError(ctx)
    )
    const tx = response.data.tx
    const messageText = `
✅ Swap transaction successful!
View [Transaction hash](https://solscan.io/tx/${tx}).
`
    await ctx.reply(messageText, { disable_web_page_preview: true, parse_mode: 'Markdown' })
})
