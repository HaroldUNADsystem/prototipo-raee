// backend/models/PuntoAcopio.js
const db = require("../db");

const PuntoAcopio = {
  // Obtener todos los puntos
  obtenerTodos: (callback) => {
    const sql = "SELECT * FROM puntos_acopio";
    db.query(sql, callback);
  },

  // Crear un nuevo punto de acopio
  crear: (datos, callback) => {
    const { nombre, direccion, latitud, longitud, tipo_residuos } = datos;

    if (!nombre || !direccion || !latitud || !longitud || !tipo_residuos) {
      return callback("Datos incompletos");
    }

    const sql = `
      INSERT INTO puntos_acopio (nombre, direccion, latitud, longitud, tipo_residuos)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [nombre, direccion, latitud, longitud, tipo_residuos],
      callback
    );
  }
};

module.exports = PuntoAcopio;
