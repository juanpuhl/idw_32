// RESTAURAR SESIÓN GUARDADA

(function mantenerSesionActiva() {
  // Si hay sesión activa, no hacer nada
  if (sessionStorage.getItem("usuario")) return;

  // Si existe usuario en LocalStorage, restaurar
  const usuarioGuardado = localStorage.getItem("usuario");
  const tokenGuardado = localStorage.getItem("accessToken");
  const rolGuardado = localStorage.getItem("rolUsuario");

  if (usuarioGuardado && tokenGuardado) {
    sessionStorage.setItem("usuario", usuarioGuardado);
    sessionStorage.setItem("accessToken", tokenGuardado);
    sessionStorage.setItem("rolUsuario", rolGuardado);
    const userObj = JSON.parse(usuarioGuardado);
    sessionStorage.setItem("usuarioLogueado", userObj.username);
  }
})();
