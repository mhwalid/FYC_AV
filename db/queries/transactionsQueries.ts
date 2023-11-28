const transactionsQueries = {
    findAllTransactions: `SELECT * FROM transactions`,
    findTransactionById: `SELECT * FROM transactions WHERE id = ?`,
    createTransaction: `INSERT INTO transactions (volume, type_transaction, transacted_at, user_id, share_price_id) VALUES (?, ?, NOW(), ?, ?)`
  };
  
  export default transactionsQueries;
  