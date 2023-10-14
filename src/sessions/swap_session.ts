import { BaseSession } from '@/sessions/base_session'
import BigNumber from 'bignumber.js'

export class SwapSession extends BaseSession {
    pay_token = ''
    pay_amount = new BigNumber(0)
    receive_token = ''
    reset() {
        Object.assign(this, new SwapSession())
    }
}
