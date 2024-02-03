const walletSharePriceQueries = {
  findById: `SELECT * FROM wallet_share_price WHERE id = ?`,
  findByUserId: `SELECT * FROM wallet_share_price WHERE user_id = ?`,
  create:
    `INSERT INTO wallet_share_price (volume, created_at, updated_at, share_price_id, user_id) VALUES (?, NOW(), NOW(), ?, ?)`,
  updateVolume:
    `UPDATE wallet_share_price SET volume = ?, updated_at = NOW() WHERE id = ?`,
  findUserSharePrice:
    `SELECT * FROM wallet_share_price WHERE user_id = ? AND share_price_id = ?`,
};

export default walletSharePriceQueries;
