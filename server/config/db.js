const sql = require('mssql/msnodesqlv8');

const config = {
  server: 'DESKTOP-LHNRSR9\\SQLEXPRESS',
  database: 'EcommerceDB',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect(); // ✅ Only ONCE here

module.exports = { sql, pool, poolConnect };
