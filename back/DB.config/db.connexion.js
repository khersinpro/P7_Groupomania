const mysql = require('mysql2');

exports.connect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'groupomania'
});