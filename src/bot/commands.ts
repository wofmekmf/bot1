import type { BotContext } from '@/bot/context'
import { mainMenu } from '@/menus/main_menu'
import { mainMenuText } from '@/menus/menu_text'
import { Composer } from 'grammy'

export const commandComposer = new Composer<BotContext>()

const start = async (ctx: BotContext) => {
    ctx.session.global.chat_id = ctx.chat?.id ?? 0
    ctx.session.global.message_id = ctx.msg?.message_id ?? 0
    const text = await mainMenuText(ctx)
    ctx.reply(text, { reply_markup: mainMenu, parse_mode: 'Markdown', disable_web_page_preview: true })
}

commandComposer.command('menu', start)
commandComposer.command('start', start)
