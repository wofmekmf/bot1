import { FileAdapter } from '@grammyjs/storage-file'
import { commandComposer } from '@/bot/commands'
import { BotContext } from '@/bot/context'
import { menuComposer } from '@/bot/menus'
import { questionComposer } from '@/bot/questions'
import { BaseSession } from '@/sessions/base_session'
import { GlobalSession } from '@/sessions/global_session'
import { SwapSession } from '@/sessions/swap_session'
import { TransferSession } from '@/sessions/transfer_session'
import 'dotenv/config'
import { GrammyError, Bot, session, Context } from 'grammy'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { AxiosResponse } from 'axios'

let config
if (process.env.ENABLE_LOCAL_PROXY === 'yes') {
    const httpAgent = new HttpsProxyAgent(process.env.LOCAL_PROXY ?? 'http://127.0.0.1:1087')
    config = {
        agent: httpAgent,
        compress: true,
    }
} else {
    config = {
        compress: true,
    }
}

export const bot = new Bot<BotContext>(process.env.TELEGRAM_TOKEN ?? '', {
    client: {
        baseFetchConfig: config,
    },
})

function getSessionKey(ctx: Context): string | undefined {
    // Give every user their personal session storage
    // (will be shared across groups and in their private chat)
    return ctx.from?.id.toString()
}
const initSession = <T extends typeof BaseSession>(dir: string, ctor: T) => {
    return {
        initial: () => new ctor(),
        storage: new FileAdapter({
            dirName: 'sessions/' + dir,
            deserializer: data => new ctor().updateFromJSON(data),
        }),
        getSessionKey,
    }
}

bot.use(
    session({
        type: 'multi',
        global: {
            initial: () => new GlobalSession(),
            storage: new FileAdapter({
                dirName: 'sessions/' + 'global',
                deserializer: data => new GlobalSession().updateFromJSON(data),
            }),
            getSessionKey,
        },
        transfer: {
            initial: () => new TransferSession(),
            storage: new FileAdapter({
                dirName: 'sessions/' + 'transfer',
                deserializer: data => new TransferSession().updateFromJSON(data),
            }),
            getSessionKey,
        },
        swap: {
            initial: () => new SwapSession(),
            storage: new FileAdapter({
                dirName: 'sessions/' + 'swap',
                deserializer: data => new SwapSession().updateFromJSON(data),
            }),
            getSessionKey,
        }
    })
)

// order matters
bot.use(menuComposer)
bot.use(questionComposer)
bot.use(commandComposer)

bot.catch(err => {
    const ctx = err.ctx
    console.error(`Error while handling update ${ctx.update.update_id}:`)
    const e = err.error as any
    if (e instanceof GrammyError) {
        console.error('Error in grammy requests')
        console.error(e.description)
    } else if ('response' in e) {
        console.error('Error in http requests')
        const response = e.response as AxiosResponse
        console.error(response.status)
        console.error(response.data)
        console.error(response.config)
    } else {
        console.error('Unknown error:')
        console.error(e)
    }
})
