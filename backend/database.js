import mysql from "mysql2"
import dotenv from 'dotenv'
dotenv.config();

const pool = mysql.createPool({ //pool of connections that can be reused
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}).promise();

export { pool };
