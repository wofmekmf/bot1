import { createMenu, fingerprint, handleCommonError } from '@/bot/common'
import { BotContext } from '@/bot/context'
import { post } from '@/lib/http'
import { balanceQuestion } from '@/questions/balance_question'
import { swapPayAmountQuestion } from '@/questions/swap_pay_amount_question'
import { swapPayTokenQuestion } from '@/questions/swap_pay_token_question'
import { swapReceiveTokenQuestion } from '@/questions/swap_receive_token_question'
import { transferQuestion } from '@/questions/transfer_question'
import { unwrapSolQuestion } from '@/questions/unwrap_sol_question'
import { wrapSolQuestion } from '@/questions/wrap_sol_question'


export const swapMenu = createMenu('swap_menu', { fingerprint })
    .text('↗️ You Pay ↗️')
    .row()
    .text(
        ctx => `Token: ${ctx.session.swap.pay_token || '-'}`,
        ctx => {
            swapPayTokenQuestion.replyWithMarkdown(ctx, 'Please enter the token address you want to pay.')
        }
    )
    .text(
        ctx => `Amount: ${ctx.session.swap.pay_amount.gt(0) ? ctx.session.swap.pay_amount.toFixed(0) : '-'}`,
        ctx => {
            swapPayAmountQuestion.replyWithMarkdown(ctx, 'Please enter the token amount you want to pay.')
        }
    )
    .row()
    .text('↙️ You Receive: ↙️')
    .row()
    .text(
        ctx => `Token: ${ctx.session.swap.receive_token || '-'}`,
        ctx => {
            swapReceiveTokenQuestion.replyWithMarkdown(ctx, 'Please enter the token address you want to receive.')
        }
    )
    .row()
    .text('Execute Swap', async ctx => {
        const chat_id = ctx.chat?.id
        const { pay_amount, pay_token, receive_token } = ctx.session.swap
        if (pay_amount.isZero() || !pay_token || !receive_token) {
            ctx.reply('Please fill in the required fields.')
            return
        }
        const response = await post<{ data: { tx: string } }>('/swap', {
            uid: chat_id,
            amount_in: pay_amount.toNumber(),
            a_mint: pay_token,
            b_mint: receive_token,
        }).catch(handleCommonError(ctx))
        const tx = response.data.tx
        const messageText = `
✅ Transfer successful!
View [Transaction hash](https://solscan.io/tx/${tx}).`
        await ctx.reply(messageText, { disable_web_page_preview: true, parse_mode: 'Markdown' })
    })
    .row()
