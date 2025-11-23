// backend/routes/puntos.js
const express = require("express");
const router = express.Router();
const PuntoAcopio = require("../models/PuntoAcopio");

// Obtener todos los puntos
router.get("/", (req, res) => {
  PuntoAcopio.obtenerTodos((err, resultados) => {
    if (err) return res.status(500).json({ error: "Error al obtener puntos" });
    res.json(resultados);
  });
});

// Crear un punto nuevo
router.post("/", (req, res) => {
  const datos = req.body;
  PuntoAcopio.crear(datos, (err, resultado) => {
    if (err) return res.status(500).json({ error: "Error al crear punto" });
    res.status(201).json({ mensaje: "Punto creado correctamente" });
  });
});

module.exports = router;
