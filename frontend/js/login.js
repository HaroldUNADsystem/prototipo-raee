// frontend/js/login.js
const formLogin = document.getElementById("formLogin");
const mensajeError = document.getElementById("mensajeError");

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensajeError.hidden = true;

  const datos = {
    correo: document.getElementById("correo").value.trim(),
    password: document.getElementById("password").value.trim(),
  };

  try {
    const resp = await fetch("http://localhost:3000/api/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (!resp.ok) {
      mensajeError.hidden = false;
      return;
    }

    const data = await resp.json();
    // Ejemplo: { token: "...", usuario: { id, nombre, rol } }
    localStorage.setItem("usuarioRAEE", JSON.stringify(data.usuario));
    localStorage.setItem("tokenRAEE", data.token);

    // Redirigir al dashboard
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Error en el login:", error);
    mensajeError.textContent = "Error de conexión con el servidor.";
    mensajeError.hidden = false;
  }
});
