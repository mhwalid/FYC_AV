const walletHistoryQueries = {
  findAll: `SELECT * FROM wallet_history`,
  findByUserId: `SELECT * FROM wallet_history WHERE user_id = ?`,
  create:
    `INSERT INTO wallet_history (value, operation_type, created_at, user_id) VALUES (?, ?, NOW(), ?)`,
};

export default walletHistoryQueries;
