// backend/app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const usuariosRoutes = require("./routes/usuarios");
const puntosRoutes = require("./routes/puntos");
const reportesRoutes = require("./routes/reportes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Rutas de la API
app.use("/api/usuarios", usuariosRoutes);  // ✔️ Solo esta línea
app.use("/api/puntos", puntosRoutes);
app.use("/api/reportes", reportesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
