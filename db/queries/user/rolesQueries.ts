const roleQueries = {
  findAll: `SELECT * FROM roles`,
  findById: `SELECT * FROM roles WHERE id = ?`,
  findByName: `SELECT * FROM roles WHERE name = ?`,
  findByUserId: `SELECT *
                FROM users AS u
                JOIN roles AS r ON u.role_id = r.id
                WHERE u.id = ?;`,
  create: `INSERT INTO roles (name, created_at) VALUES (?, NOW())`,
  update: `UPDATE roles SET name = ?, updated_at = NOW() WHERE id = ?`,
  delete: `DELETE FROM roles WHERE id = ?`,
  checkRoleInUserUsage: `SELECT COUNT(*) as count FROM users WHERE role_id = ?`
};

export default roleQueries;
