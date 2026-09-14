import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "user1",
  password: process.env.MYSQL_PASSWORD,
  database: "ecommerce",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;