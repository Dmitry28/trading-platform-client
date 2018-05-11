import { getRecentTransactions } from '../services/api/transactions';
import web3Service from '../services/web3';

import { dispatcher } from '../store';

export function performGetRecentTransactions(userId, page) {
    dispatcher.dispatchPromise(
        getRecentTransactions,
        'GET_RECENT_TRANSACTIONS',
        state => state.Transactions.recentTransactions.loading,
        [userId, page]
    );
}

export function performGetAvailableAddresses() {
    dispatcher.dispatchPromise(
        web3Service.getAddresses.bind(web3Service),
        'GET_AVAILABLE_ADDRESSES',
        state => state.Transactions.availableAddresses.loading
    );
}

export function performGetOpenTradePositions() {
    // TODO TBD
}
