// backend/db.js
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "raee_db",
});

connection.connect((err) => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
    return;
  }
  console.log("Conexión a MySQL exitosa");
});

module.exports = connection;
