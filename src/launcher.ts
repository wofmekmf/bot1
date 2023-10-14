import { bot } from '@/bot/bot'
import BigNumber from 'bignumber.js'

BigNumber.config({ EXPONENTIAL_AT: [-18, 30] })

bot.start()
console.log('Bot started...')
