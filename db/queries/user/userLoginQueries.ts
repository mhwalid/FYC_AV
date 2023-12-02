const userLoginQueries = {
  findAll: `SELECT * FROM user_logins`,
  findByUserId: `SELECT * FROM user_logins WHERE user_id = ?`,
  create: `INSERT INTO user_logins (user_id, login_at) VALUES (?, NOW())`
};

export default userLoginQueries;
