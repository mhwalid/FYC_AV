const usersQueries = {
    findAllUsers: `SELECT * FROM users`,
    findUserById: `SELECT * FROM users WHERE id = ?`,
    findUserByEmail: `SELECT * FROM users WHERE email = ?`,
    deleteUserById: `DELETE FROM users WHERE id = ?`,
    createUser: `INSERT INTO users (first_name, last_name, email, password, account, is_cdu, cdu_accepted_at, register_at, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
    updateUserRoleById: `UPDATE users SET role_id = ?, updated_at = NOW() WHERE id = ?`,
    updateUserInfoById: `UPDATE users SET {updates}, updated_at = NOW() WHERE id = ?`,
    updateUserAccountById: `UPDATE users SET account = ?, updated_at = NOW() WHERE id = ?`,
    checkUserInTransactionUsage: "SELECT COUNT(*) as count FROM transactions WHERE user_id = ?"
  };
  
  export default usersQueries;
  