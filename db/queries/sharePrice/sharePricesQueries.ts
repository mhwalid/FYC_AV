const sharePricesQueries = {
  findAll: `SELECT * FROM share_prices`,
  findById: `SELECT * FROM share_prices WHERE id = ? LIMIT 1`,
  findByName: `SELECT * FROM share_prices WHERE name = ?`,
  create:
    `INSERT INTO share_prices (name, value, volume, created_at) VALUES (?, ?, ?, NOW())`,
  update:
    `UPDATE share_prices SET {updateString}, updated_at = NOW() WHERE id = ?`,
};

export default sharePricesQueries;
