import { BotContext } from '@/bot/context'
import { mainMenu } from '@/menus/main_menu'
import { Composer } from 'grammy'

export const menuComposer = new Composer<BotContext>()
menuComposer.use(mainMenu)
