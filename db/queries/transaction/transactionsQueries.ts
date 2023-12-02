const transactionsQueries = {
  findAll: `SELECT * FROM transactions`,
  findById: `SELECT * FROM transactions WHERE id = ?`,
  findByUserId: `SELECT * FROM transactions WHERE user_id = ?`,
  create: `INSERT INTO transactions (volume, value, type_transaction, transacted_at, user_id, share_price_history_id) VALUES (?, ?, ?, NOW(), ?, ?)`
};

export default transactionsQueries;
