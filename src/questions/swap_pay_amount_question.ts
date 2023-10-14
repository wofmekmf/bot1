import { StatelessQuestion } from '@grammyjs/stateless-question'
import { clearAndNotice } from '@/bot/common'
import { BotContext } from '@/bot/context'
import BigNumber from 'bignumber.js'
import { swapMenu } from '@/menus/swap_menu'
import { swapMenuText } from '@/menus/menu_text'

export const swapPayAmountQuestion = new StatelessQuestion<BotContext>('swap_pay_Amount_question', async ctx => {
    const text = ctx.message.text?.trim() ?? ''
    const n = parseFloat(text)
    if (Number.isNaN(n) || n <= 0) {
        const text = 'Please use a valid amount.'
        await clearAndNotice(ctx, text)
        return
    }
    ctx.session.swap.pay_amount = new BigNumber(n)
    ctx.api.editMessageText(ctx.chat?.id ?? 0, ctx.session.swap.message_id, await swapMenuText(ctx), {
        reply_markup: swapMenu,
    })
})
