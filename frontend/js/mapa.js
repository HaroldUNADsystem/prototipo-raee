// frontend/js/mapa.js
const mapa = L.map("mapa").setView([5.3378, -72.3959], 13); // Coordenadas aproximadas de Yopal

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(mapa);

// Ejemplo de marcador estático (luego se alimenta desde la API)
const ejemploPunto = L.marker([5.3405, -72.394]).addTo(mapa);
ejemploPunto.bindPopup("<strong>Punto de acopio RAEE</strong><br>Carrera 20 # 15-30");

// Carga dinámica desde la API
fetch("http://localhost:3000/api/puntos")
  .then((res) => res.json())
  .then((puntos) => {
    puntos.forEach((p) => {
      const marcador = L.marker([p.latitud, p.longitud]).addTo(mapa);
      marcador.bindPopup(`
        <strong>${p.nombre}</strong><br/>
        ${p.direccion}<br/>
        <em>Residuos: ${p.tipo_residuos}</em>
      `);
    });
  })
  .catch((err) => {
    console.error("Error cargando puntos de acopio:", err);
  });
