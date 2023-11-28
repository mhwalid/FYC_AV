const roleQueries = {
    findAllRoles: `SELECT * FROM roles`,
    findRoleById: `SELECT * FROM roles WHERE id = ?`,
    findRoleByName: `SELECT * FROM roles WHERE name = ?`,
    deleteRoleById: `DELETE FROM roles WHERE id = ?`,
    createRole: `INSERT INTO roles (name, created_at) VALUES (?, NOW())`,
    updateRoleById: `UPDATE roles SET name = ?, updated_at = NOW() WHERE id = ?`,
    checkRoleInUserUsage: `SELECT COUNT(*) as count FROM users WHERE role_id = ?`
  };
  
  export default roleQueries;
  