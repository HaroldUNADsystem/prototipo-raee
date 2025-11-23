// frontend/js/dashboard.js

const usuarioGuardado = localStorage.getItem("usuarioRAEE");
const token = localStorage.getItem("tokenRAEE");

// Si no hay sesión, redirigimos al login
if (!usuarioGuardado || !token) {
  window.location.href = "login.html";
}

const usuario = JSON.parse(usuarioGuardado);
document.getElementById("nombreUsuario").textContent = usuario.nombre || "Administrador";

document.getElementById("btnSalir").addEventListener("click", () => {
  localStorage.removeItem("usuarioRAEE");
  localStorage.removeItem("tokenRAEE");
  window.location.href = "index.html";
});

async function cargarResumen() {
  try {
    const resp = await fetch("http://localhost:3000/api/dashboard/resumen", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resp.ok) throw new Error("Error en resumen");

    const data = await resp.json();
    // Ejemplo de data:
    // { totalRaeeKg: 150, totalPuntos: 5, totalUsuarios: 30 }
    document.getElementById("totalRaee").textContent = `${data.totalRaeeKg} kg`;
    document.getElementById("totalPuntos").textContent = data.totalPuntos;
    document.getElementById("totalUsuarios").textContent = data.totalUsuarios;
  } catch (error) {
    console.error(error);
  }
}

async function cargarReportes() {
  try {
    const resp = await fetch("http://localhost:3000/api/reportes/ultimos", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resp.ok) throw new Error("Error en reportes");

    const data = await resp.json();
    const tbody = document.getElementById("tbodyReportes");
    tbody.innerHTML = "";

    data.forEach((rep) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${new Date(rep.fecha_reporte).toLocaleDateString()}</td>
        <td>${rep.usuario_nombre}</td>
        <td>${rep.punto_nombre}</td>
        <td>${rep.tipo_residuo}</td>
        <td>${rep.cantidad}</td>
      `;
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error(error);
  }
}

async function cargarGrafico() {
  try {
    const resp = await fetch("http://localhost:3000/api/reportes/por-tipo", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resp.ok) throw new Error("Error en gráfico");

    const data = await resp.json();
    // Ejemplo de data: [{ tipo_residuo: "Computadores", total: 40 }, ...]
    const etiquetas = data.map((item) => item.tipo_residuo);
    const valores = data.map((item) => item.total);

    const ctx = document.getElementById("graficoRaee").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: "Cantidad de RAEE",
            data: valores,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
}

// Cargar todo al entrar al dashboard
cargarResumen();
cargarReportes();
cargarGrafico();

async function actualizarContadores() {
  const usuarios = await fetch("http://localhost:3000/api/usuarios").then(r => r.json());
  const puntos = await fetch("http://localhost:3000/api/puntos").then(r => r.json());
  const reportes = await fetch("http://localhost:3000/api/reportes").then(r => r.json());

  document.getElementById("totalUsuarios").textContent = usuarios.length;
  document.getElementById("totalPuntos").textContent = puntos.length;
  document.getElementById("totalReportes").textContent = reportes.length;
}

actualizarContadores();
