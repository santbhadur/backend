const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // ✅ Your MySQL username
  password: '',          // ✅ Your MySQL password (leave empty if no password)
  database: 'invoiceDB',
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

module.exports = connection;
