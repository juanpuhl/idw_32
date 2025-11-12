// ============================
// FUNCIÓN GLOBAL DE CIERRE DE SESIÓN
// ============================
function cerrarSesion() {
  Swal.fire({
    title: 'Cerrar sesión',
    text: '¿Deseás cerrar tu sesión actual?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      sessionStorage.clear();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('usuario');
      localStorage.removeItem('usuarioLogueado');
      localStorage.removeItem('rolUsuario');

      Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        window.location.href = 'login.html';
      });
    }
  });
}
