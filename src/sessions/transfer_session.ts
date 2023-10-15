import { BaseSession } from '@/sessions/base_session'
import BigNumber from 'bignumber.js'

export class TransferSession extends BaseSession {
    token_address = ''
    wallet_address = ''
    amount = new BigNumber(0)
    decimals = 0
    reset() {
        Object.assign(this, new TransferSession())
    }
}
