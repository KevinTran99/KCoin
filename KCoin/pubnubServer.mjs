import PubNub from 'pubnub';
import Transaction from './models/Transaction.mjs';

const CHANNELS = {
  DEMO: 'DEMO',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION_POOL: 'TRANSACTION_POOL',
};

export default class PubNubServer {
  constructor({ blockchain, transactionPool, wallet, credentials }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubnub = new PubNub(credentials);
    this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
    this.pubnub.addListener(this.listener());
  }

  broadcast() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  broadcastTransactionPool() {
    this.publish({
      channel: CHANNELS.TRANSACTION_POOL,
      message: JSON.stringify(this.transactionPool.transactionMap),
    });
  }

  listener() {
    return {
      message: (msgObject) => {
        const { channel, message } = msgObject;
        const msg = JSON.parse(message);

        console.log(
          `Message received from channel: ${channel}, message: ${message}`
        );

        switch (channel) {
          case CHANNELS.BLOCKCHAIN:
            this.blockchain.synchronizeChains(msg, () => {
              this.transactionPool.clearBlockTransactions({ chain: msg });
            });
            break;
          case CHANNELS.TRANSACTION_POOL:
            const transactions = Object.values(msg).map(
              (tx) => new Transaction(tx)
            );

            const transactionMap = transactions.reduce((map, transaction) => {
              map[transaction.id] = transaction;
              return map;
            }, {});

            this.transactionPool.synchronizeTransactions(transactionMap);
            break;
          default:
            return;
        }
      },
    };
  }

  publish({ channel, message }) {
    this.pubnub.publish({ channel, message });
  }
}
