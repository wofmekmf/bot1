import { StatelessQuestion } from '@grammyjs/stateless-question'
import { clearAndNotice } from '@/bot/common'
import { BotContext } from '@/bot/context'
import { post } from '@/lib/http'

export const unwrapSolQuestion = new StatelessQuestion<BotContext>('unwrap_sol_question', async ctx => {
    const text = ctx.message.text?.trim() ?? ''
    const n = parseFloat(text)
    if (Number.isNaN(n) || n <= 0) {
        const text = 'Please use a valid amount.'
        await clearAndNotice(ctx, text)
        return
    }
    const messageText = `
✅ Swap transaction successful!
View [Transaction hash](https://google.com).
`
    await ctx.reply(messageText, { disable_web_page_preview: true, parse_mode: 'Markdown' })
})
