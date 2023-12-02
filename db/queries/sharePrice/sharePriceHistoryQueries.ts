const sharePriceHistoryQueries = {
  findAll: `SELECT * FROM share_price_history`,
  findBySharePriceId: `SELECT * FROM share_price_history WHERE share_price_id = ?`,
  create: `INSERT INTO share_price_history (old_value, old_volume, created_at, share_price_id) VALUES (?, ?, NOW(), ?)`
};

export default sharePriceHistoryQueries;
