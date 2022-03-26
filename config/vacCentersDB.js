const mysql = require('mysql');

var connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 's097745763Tan',
  database: 'vacCenter'
});

module.exports = connection;
