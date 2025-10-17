document.addEventListener("DOMContentLoaded", () => {
  const usuario = sessionStorage.getItem("usuarioLogueado");
  const loginItem = document.querySelector(".nav-item-login");

  // Si no hay usuario y no estás en el login, redirige
  if (!usuario && !window.location.href.includes("login.html")) {
    window.location.href = "login.html";
    return;
  }

  // Si hay usuario, reemplazá el "Login" por el botón de cerrar sesión
  if (usuario && loginItem) {
    loginItem.innerHTML = `
      <a href="#" id="cerrarSesionBtn" class="nav-link fw-bold text-white">Cerrar sesión</a>
    `;
  } else if (!usuario && loginItem) {
    // Si no hay usuario, mostrás el botón de login
    loginItem.innerHTML = `
      <a class="nav-link fw-bold" href="login.html">Login</a>
    `;
  }

  // Escuchador del botón cerrar sesión (si existe)
  const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const result = await Swal.fire({
        title: "¿Cerrar sesión?",
        text: "Se cerrará tu sesión actual.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, cerrar sesión",
        cancelButtonText: "Cancelar"
      });

      if (result.isConfirmed) {
        sessionStorage.removeItem("usuarioLogueado");
        await Swal.fire({
          title: "Sesión cerrada",
          text: "Has cerrado sesión correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
        window.location.href = "login.html";
      }
    });
  }
});
