// frontend/js/register.js
const formRegistro = document.getElementById("formRegistro");
const mensajeOk = document.getElementById("mensajeOk");
const mensajeError = document.getElementById("mensajeError");

formRegistro.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensajeOk.hidden = true;
  mensajeError.hidden = true;

  const datos = {
    nombre: document.getElementById("nombre").value.trim(),
    correo: document.getElementById("correo").value.trim(),
    password: document.getElementById("password").value.trim(),
    rol: document.getElementById("rol").value,
  };

  if (!datos.nombre || !datos.correo || !datos.password) {
    mensajeError.textContent = "Todos los campos son obligatorios.";
    mensajeError.hidden = false;
    return;
  }

  try {
    const resp = await fetch("http://localhost:3000/api/usuarios/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      if (resp.status === 409) {
        mensajeError.textContent = errorData.error || "El correo ya está registrado.";
      } else {
        mensajeError.textContent = errorData.error || "Error al registrar el usuario.";
      }
      mensajeError.hidden = false;
      return;
    }

    // Si todo va bien
    formRegistro.reset();
    mensajeOk.hidden = false;
  } catch (error) {
    console.error("Error en el registro:", error);
    mensajeError.textContent = "Error de conexión con el servidor.";
    mensajeError.hidden = false;
  }
});
