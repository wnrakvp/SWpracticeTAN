const mysql = require('mysql');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 's097745763Tan',
  database: 'vacCenter',
});

module.exports = connection;
