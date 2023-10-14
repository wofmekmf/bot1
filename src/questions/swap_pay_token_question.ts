import { StatelessQuestion } from '@grammyjs/stateless-question'
import { clearAndNotice } from '@/bot/common'
import { BotContext } from '@/bot/context'
import { REGEX_TOKEN_ADDR } from '@/lib/constants'
import { swapMenu } from '@/menus/swap_menu'
import { swapMenuText } from '@/menus/menu_text'

export const swapPayTokenQuestion = new StatelessQuestion<BotContext>('swap_pay_token_question', async ctx => {
    const text = ctx.message.text?.trim()
    if (!text || !REGEX_TOKEN_ADDR.test(text)) {
        const text = 'Please use a valid token address.'
        await clearAndNotice(ctx, text)
        return
    }
    ctx.session.swap.pay_token = text
    ctx.api.editMessageText(ctx.chat?.id ?? 0, ctx.session.swap.message_id, await swapMenuText(ctx), {
        reply_markup: swapMenu,
    })
})
