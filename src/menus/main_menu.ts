import { createMenu, fingerprint, handleCommonResponse, handleCommonError } from '@/bot/common'
import { BotContext } from '@/bot/context'
import { get, post } from '@/lib/http'
import { swapMenuText } from '@/menus/menu_text'
import { swapMenu } from '@/menus/swap_menu'
import { balanceQuestion } from '@/questions/balance_question'
import { transferQuestion } from '@/questions/transfer_question'
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

mainMenu.register(swapMenu)
