import { StatelessQuestion } from '@grammyjs/stateless-question'
import { clearAndNotice } from '@/bot/common'
import { BotContext } from '@/bot/context'
import { REGEX_TOKEN_ADDR, REGEX_WALLET_ADDR } from '@/lib/constants'
import { transferQuestion3 } from '@/questions/transfer_question_3'

export const transferQuestion2 = new StatelessQuestion<BotContext>('transfer_question_2', async ctx => {
    const text = ctx.message.text?.trim()
    if (!text || !REGEX_WALLET_ADDR.test(text)) {
        const text = 'Please use a valid wallet address.'
        await clearAndNotice(ctx, text)
        return
    }
    ctx.session.transfer.wallet_address = text
    await transferQuestion3.replyWithMarkdown(ctx, 'Please enter the amount you want to transfer.')
})
