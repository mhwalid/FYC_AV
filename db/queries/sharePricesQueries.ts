const sharePricesQueries = {
    findAll: `SELECT * FROM share_prices`,
    findById: `SELECT * FROM share_prices WHERE id = ?`,
    findByName: `SELECT * FROM share_prices WHERE name = ?`,
    create: `INSERT INTO share_prices (name, value, volume, created_at) VALUES (?, ?, ?, NOW())`,
    update: `UPDATE share_prices SET {updateString}, updated_at = NOW() WHERE id = ?`,
    delete: `DELETE FROM share_prices WHERE id = ?`,
    checkSharePriceInTransactionUsage: `SELECT COUNT(*) as count FROM transactions WHERE share_price_id = ?`
  };
  
  export default sharePricesQueries;
  