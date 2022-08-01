const mysql = require('mysql2');
require('dotenv').config()

exports.connect = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE
});