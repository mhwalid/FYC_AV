const usersQueries = {
  findAll: `SELECT * FROM users`,
  findById: `SELECT * FROM users WHERE id = ?`,
  findByEmail: `SELECT * FROM users WHERE email = ?`,
  create: `INSERT INTO users (first_name, last_name, email, password, wallet, is_cdu, cdu_accepted_at, register_at, is_active, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), true, ?)`,
  updateRole: `UPDATE users SET role_id = ?, updated_at = NOW() WHERE id = ?`,
  updateInfo: `UPDATE users SET {updateString}, updated_at = NOW() WHERE id = ?`,
  updateIsActive: `UPDATE users SET is_active = ?, updated_at = NOW(), unsubscribe_at = NOW() WHERE id = ?`,
  updateWallet: `UPDATE users SET wallet = ?, updated_at = NOW() WHERE id = ?`,
  updateUserUnsubscribe: `UPDATE users SET is_active = false, unsubscribe_at = NOW(), role_id = NULL WHERE id = ?`,
};

export default usersQueries;
