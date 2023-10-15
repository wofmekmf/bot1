import { BotContext } from '@/bot/context'
import { get, post } from '@/lib/http'
import BigNumber from 'bignumber.js'

export const mainMenuText = async (ctx: BotContext) => {
    return `
·Welcome to @Sofa6bot!
${await yourWalletText(ctx)}
  `.trim()
}
export const swapMenuText = async (ctx: BotContext) => {
    return `
🔄 Swap
${await yourWalletText(ctx)}
  `.trim()
}

const yourWalletText = async (ctx: BotContext) => {
    const chat_id = ctx.session.global.chat_id

    const response = await get<{ data: { user_wallet: string } }>(`/user`, { uid: chat_id }).catch(() => null)
    const user = response ? response.data : await post<{ user_wallet: string }>('/user', { uid: chat_id })
    const response2 = await get<{ data: { sol_balance: number } }>(`/balance`, { uid: chat_id }).catch(() => null)
    const sol_balance = response2 ? response2.data.sol_balance : 0

    return `
==== Your Wallet ====
SOL Balance: ${sol_balance} Sol
Address: \`${user.user_wallet}\`
  `.trim()
}
