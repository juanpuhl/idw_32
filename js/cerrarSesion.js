document.addEventListener("DOMContentLoaded", () => {
  const usuario = sessionStorage.getItem("usuarioLogueado");
  const rol = sessionStorage.getItem("rolUsuario");
  const loginItem = document.querySelector(".nav-item-login");

  //identificar archivo actual y listas
  let path = window.location.pathname.split("/").pop() || "index.html";
  path = path.toLowerCase();

  const PUBLIC_PAGES = new Set(["index.html", "institucional.html", "contacto.html", "login.html"]);
  const ADMIN_PAGES  = new Set(["panelcontrol.html", "altamedicos.html","turnos.html"]);

  // si no hay usuario y NO es pública → login
  if (!usuario && !PUBLIC_PAGES.has(path)) {
    window.location.href = "login.html";
    return;
  }

  // si es admin y NO sos admin va al login
  if (ADMIN_PAGES.has(path) && rol !== "admin") {
    window.location.href = "login.html";
    return;
  }


  // solo redirige si NO es publica.
  if (!usuario && !PUBLIC_PAGES.has(path)) {
    window.location.href = "login.html";
    return;
  }

  // --- queda igual que antes
  if (usuario && loginItem) {
    loginItem.innerHTML = `
      <a href="#" id="cerrarSesionBtn" class="nav-link fw-bold text-white">Cerrar sesión</a>
    `;
  } else if (!usuario && loginItem) {
    loginItem.innerHTML = `
      <a class="nav-link fw-bold" href="login.html">Login</a>
    `;
  }

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
        sessionStorage.removeItem("rolUsuario");
        await Swal.fire({ title: "Sesión cerrada", icon: "success", timer: 1500, showConfirmButton: false });
        window.location.href = "index.html";
      }
    });
  }
});
