// backend/routes/usuarios.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

/* ============================================================
   RUTA: POST /api/usuarios/registro
   Descripción:
   Crea un usuario nuevo y guarda la contraseña cifrada en MySQL
   ============================================================ */
router.post("/registro", (req, res) => {
  const { nombre, correo, password, rol } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const rolFinal = rol || "usuario";

  // Verificar que no exista ya el correo
  const checkSql = "SELECT id_usuario FROM usuarios WHERE correo = ?";
  db.query(checkSql, [correo], (err, rows) => {
    if (err) {
      console.error("Error verificando usuario:", err);
      return res.status(500).json({ error: "Error del servidor" });
    }

    if (rows.length > 0) {
      return res.status(409).json({ error: "El correo ya está registrado" });
    }

    // Cifrar contraseña
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error("Error al cifrar contraseña:", err);
        return res.status(500).json({ error: "Error en el servidor" });
      }

      const insertSql =
        "INSERT INTO usuarios (nombre, correo, password_hash, rol) VALUES (?, ?, ?, ?)";

      db.query(insertSql, [nombre, correo, hash, rolFinal], (err, resultado) => {
        if (err) {
          console.error("Error al crear usuario:", err);
          return res.status(500).json({ error: "Error al crear usuario" });
        }

        res.status(201).json({
          mensaje: "Usuario creado correctamente",
          id_usuario: resultado.insertId,
        });
      });
    });
  });
});

/* ============================================================
   RUTA: POST /api/usuarios/login
   Descripción:
   Autentica usuario y valida password con bcrypt
   ============================================================ */
router.post("/login", (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res
      .status(400)
      .json({ error: "Correo y contraseña son obligatorios" });
  }

  const sql = "SELECT * FROM usuarios WHERE correo = ? LIMIT 1";

  db.query(sql, [correo], (err, resultados) => {
    if (err) {
      console.error("Error en consulta de login:", err);
      return res.status(500).json({ error: "Error del servidor" });
    }

    if (resultados.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const usuario = resultados[0];

    // Comparar contraseña texto vs contraseña encriptada
    bcrypt.compare(password, usuario.password_hash, (err, esValida) => {
      if (err) {
        console.error("Error comparando contraseña:", err);
        return res.status(500).json({ error: "Error del servidor" });
      }

      if (!esValida) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
      }

      // Token falso (temporal)
      const tokenFalso = "FAKE_TOKEN_RAEE";

      res.json({
        mensaje: "Inicio de sesión exitoso",
        token: tokenFalso,
        usuario: {
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol,
        },
      });
    });
  });
});

/* ============================================================
   RUTA: GET /api/usuarios
   Descripción:
   Devuelve lista de usuarios registrados
   ============================================================ */
router.get("/", (req, res) => {
  const sql =
    "SELECT id_usuario, nombre, correo, rol, fecha_registro FROM usuarios";

  db.query(sql, (err, filas) => {
    if (err) {
      console.error("Error al obtener usuarios:", err);
      return res.status(500).json({ error: "Error al obtener usuarios" });
    }
    res.json(filas);
  });
});

module.exports = router;
