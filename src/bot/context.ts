import type { MenuFlavor } from '@grammyjs/menu'
import { GlobalSession } from '@/sessions/global_session'
import { SwapSession } from '@/sessions/swap_session'
import { TransferSession } from '@/sessions/transfer_session'
import type { SessionFlavor } from 'grammy'
import { Context } from 'grammy'

export interface SessionData {}

class UserContext extends Context {}

export interface SessionData {
    global: GlobalSession
    transfer: TransferSession
    swap: SwapSession
}

export type BotContext = UserContext & SessionFlavor<SessionData> & MenuFlavor
