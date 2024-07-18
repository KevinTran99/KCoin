export default class TransactionPool {
  constructor() {
    this.transactionMap = {};
  }

  addTransaction(transaction) {
    this.transactionMap[transaction.id] = transaction;
  }

  synchronizeTransactions(transactionMap) {
    this.transactionMap = transactionMap;
  }

  transactionExist({ address }) {
    const transactions = Object.values(this.transactionMap);

    return transactions.find(
      (transaction) => transaction.inputMap.address === address
    );
  }
}
