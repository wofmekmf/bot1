import { createMenu, fingerprint, handleCommonResponse, handleCommonError } from '@/bot/common'
import { BotContext } from '@/bot/context'
import { get, post } from '@/lib/http'
import { swapMenuText } from '@/menus/menu_text'
import { swapMenu } from '@/menus/swap_menu'
import { balanceQuestion } from '@/questions/balance_question'
import { transferQuestion } from '@/questions/transfer_question'
import { wrapSolQuestion } from '@/questions/wrap_sol_question'
import type { AxiosResponse } from 'axios'
import BigNumber from 'bignumber.js'


export const mainMenu = createMenu('main_menu', { fingerprint })
    .text('Balance', ctx => {
        const text = 'Please enter the token address that you want to check the balance.'
        return balanceQuestion.replyWithMarkdown(ctx, text)
    })
    .text('Transfer', ctx => {
        const text = 'Please enter the token address you want to transfer.'
        return transferQuestion.replyWithMarkdown(ctx, text)
    })
    .submenu('Swap', 'swap_menu', async ctx => {
        ctx.session.swap.pay_amount = new BigNumber(0)
        ctx.session.swap.pay_token = ''
        ctx.session.swap.receive_token = ''
        ctx.session.swap.message_id = ctx.msg?.message_id ?? 0
        const text = await swapMenuText(ctx)
        await ctx.editMessageText(text, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
        })
    })
    .row()
    .text('WrapSOL', ctx => {
        wrapSolQuestion.replyWithMarkdown(ctx, 'Please enter the amount you want to swap SOL for WSOL.')
    })
    .text('UnwrapSOL', async ctx => {
        const response = await post<{ data: { tx: string } }>('/unwrapsol', { uid: ctx.chat?.id ?? 0 }).catch(
            handleCommonError(ctx)
        )
        const tx = response.data.tx
        // unwrapSolQuestion.replyWithMarkdown(ctx, 'Please enter the amount you want to swap WSOL for SOL.')
        const messageText = `
✅ Swap transaction successful!
View [Transaction hash](https://solscan.io/tx/${tx}).
`
        await ctx.reply(messageText, { disable_web_page_preview: true, parse_mode: 'Markdown' })
    })
    .row()

mainMenu.register(swapMenu)
