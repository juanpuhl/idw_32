document.addEventListener("DOMContentLoaded", () => {
    const rutaActual = window.location.pathname.split("/").pop();
    const usuario = sessionStorage.getItem("usuarioLogueado");
    const rol = sessionStorage.getItem("rolUsuario");

    // Páginas públicas que NO necesitan login
    const paginasPublicas = ["index.html", "turno.html", "contacto.html", "login.html", "institucional.html"];

    // Si la página actual está en las públicas, no hacer nada
    if (paginasPublicas.includes(rutaActual) || rutaActual === "") {
        console.log(`✅ Página pública: ${rutaActual}`);
        return;
    }

    // Si no hay usuario logueado → redirigir al login
    if (!usuario) {
        alert("Debe iniciar sesión para acceder a esta página.");
        window.location.href = "login.html";
        return;
    }

    // Si la página es solo para admin, verificar el rol
    const paginasSoloAdmin = ["panelControl.html", "altaMedicos.html", "usuarios.html"];
    if (paginasSoloAdmin.includes(rutaActual) && rol !== "admin") {
        alert("No tiene permisos para acceder a esta página.");
        window.location.href = "index.html";
    }
});
