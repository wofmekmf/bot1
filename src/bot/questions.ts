import type { BotContext } from '@/bot/context'
import { balanceQuestion } from '@/questions/balance_question'
import { swapPayAmountQuestion } from '@/questions/swap_pay_amount_question'
import { swapPayTokenQuestion } from '@/questions/swap_pay_token_question'
import { swapReceiveTokenQuestion } from '@/questions/swap_receive_token_question'
import { transferQuestion } from '@/questions/transfer_question'
import { transferQuestion2 } from '@/questions/transfer_question_2'
import { transferQuestion3 } from '@/questions/transfer_question_3'
import { unwrapSolQuestion } from '@/questions/unwrap_sol_question'
import { wrapSolQuestion } from '@/questions/wrap_sol_question'
import { Composer } from 'grammy'

export const questionComposer = new Composer<BotContext>()

questionComposer.use(balanceQuestion.middleware())
questionComposer.use(transferQuestion.middleware())
questionComposer.use(transferQuestion2.middleware())
questionComposer.use(transferQuestion3.middleware())
questionComposer.use(wrapSolQuestion.middleware())
questionComposer.use(unwrapSolQuestion.middleware())
questionComposer.use(swapPayTokenQuestion.middleware())
questionComposer.use(swapPayAmountQuestion.middleware())
questionComposer.use(swapReceiveTokenQuestion.middleware())
