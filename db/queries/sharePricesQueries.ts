const sharePricesQueries = {
    findAllSharePrices: `SELECT * FROM share_prices`,
    findSharePriceById: `SELECT * FROM share_prices WHERE id = ?`,
    findSharePriceByName: `SELECT * FROM share_prices WHERE name = ?`,
    deleteSharePriceById: `DELETE FROM share_prices WHERE id = ?`,
    createSharePrice: `INSERT INTO share_prices (name, created_at) VALUES (?, NOW())`,
    updateSharePriceById: `UPDATE share_prices SET {updateString}, updated_at = NOW() WHERE id = ?`,
    checkSharePriceInTransactionUsage: `SELECT COUNT(*) as count FROM transactions WHERE share_price_id = ?`
  };
  
  export default sharePricesQueries;
  