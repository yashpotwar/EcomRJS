const express = require('express');
const router = express.Router();
const { sql, pool, poolConnect } = require('../config/db');

// ✅ USER LOGIN
router.post('/user/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await poolConnect;
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, password)
      .query('SELECT * FROM Users WHERE Email = @email AND Password = @password');

    if (result.recordset.length > 0) {
      res.json({ success: true, user: result.recordset[0] });
    } else {
      res.status(401).json({ success: false, message: '❌ Invalid email or password' });
    }

  } catch (err) {
    console.error('User login error:', err);
    res.status(500).json({ success: false, message: '❌ Server error' });
  }
});

module.exports = router;
