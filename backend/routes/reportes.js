// backend/routes/reportes.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// ========== RUTAS PARA EL DASHBOARD ==========

// GET /api/reportes/ultimos
router.get("/ultimos", (req, res) => {
  const sql = `
    SELECT r.*, u.nombre AS usuario_nombre, p.nombre AS punto_nombre
    FROM reportes r
    JOIN usuarios u ON r.id_usuario = u.id_usuario
    JOIN puntos_acopio p ON r.id_punto = p.id_punto
    ORDER BY r.fecha_reporte DESC
    LIMIT 10
  `;

  db.query(sql, (err, filas) => {
    if (err) {
      console.error("Error al obtener últimos reportes:", err);
      return res.status(500).json({ error: "Error al obtener últimos reportes" });
    }
    res.json(filas);
  });
});

// GET /api/reportes/por-tipo
router.get("/por-tipo", (req, res) => {
  const sql = `
    SELECT tipo_residuo, SUM(cantidad) AS total
    FROM reportes
    GROUP BY tipo_residuo
    ORDER BY total DESC
  `;

  db.query(sql, (err, filas) => {
    if (err) {
      console.error("Error al obtener RAEE por tipo:", err);
      return res.status(500).json({ error: "Error al obtener datos" });
    }
    res.json(filas);
  });
});

// ========== CRUD BÁSICO ==========

// POST /api/reportes
router.post("/", (req, res) => {
  const { id_usuario, id_punto, tipo_residuo, cantidad } = req.body;

  if (!id_usuario || !id_punto || !tipo_residuo || !cantidad) {
    return res.status(400).json({ error: "Faltan datos del reporte" });
  }

  const sql = `
    INSERT INTO reportes (id_usuario, id_punto, tipo_residuo, cantidad)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [id_usuario, id_punto, tipo_residuo, cantidad], (err, resultado) => {
    if (err) {
      console.error("Error al registrar reporte:", err);
      return res.status(500).json({ error: "Error al registrar reporte" });
    }

    res.status(201).json({
      mensaje: "Reporte registrado correctamente",
      id_reporte: resultado.insertId,
    });
  });
});

// GET /api/reportes
router.get("/", (req, res) => {
  const sql = `
    SELECT r.*, u.nombre AS usuario_nombre, p.nombre AS punto_nombre
    FROM reportes r
    JOIN usuarios u ON r.id_usuario = u.id_usuario
    JOIN puntos_acopio p ON r.id_punto = p.id_punto
    ORDER BY r.fecha_reporte DESC
  `;

  db.query(sql, (err, filas) => {
    if (err) {
      console.error("Error al obtener reportes:", err);
      return res.status(500).json({ error: "Error al obtener reportes" });
    }
    res.json(filas);
  });
});

module.exports = router;
