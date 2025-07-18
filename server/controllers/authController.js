const { sql, pool, poolConnect } = require('../config/db');

const login = async (req, res) => {
  const { username, password } = req.body;

  // 🟡 Debugging: Input log
  console.log("Input Username:", username);
  console.log("Input Password:", password);

  try {
   // const pool = await poolPromise.connect();
    await poolConnect;
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('password', sql.NVarChar, password)
      .query(`
        SELECT * FROM AdminUsers 
        WHERE Username COLLATE SQL_Latin1_General_CP1_CI_AS = @username 
        AND Password COLLATE SQL_Latin1_General_CP1_CI_AS = @password
      `);

    if (result.recordset.length > 0) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { login };
