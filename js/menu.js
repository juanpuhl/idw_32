// ============================
// CONTROL DE MENÚ Y SESIÓN
// ============================
document.addEventListener('DOMContentLoaded', () => {

  // Intentar recuperar datos de sesión (temporal o persistente)
  const rol = sessionStorage.getItem('rolUsuario') || localStorage.getItem('rolUsuario');
  const usuario = sessionStorage.getItem('usuarioLogueado') || localStorage.getItem('usuarioLogueado');
  const adminLinks = document.querySelectorAll('.admin-only');
  const loginItem = document.querySelector('.nav-item-login');

  // ============================
// Mostrar enlace a perfil si hay sesión
// ============================
const navList = document.querySelector('.navbar-nav');
if (usuario && navList && !document.querySelector('.nav-item-perfil')) {
  const perfilItem = document.createElement('li');
  perfilItem.className = 'nav-item nav-item-perfil';
  perfilItem.innerHTML = `<a class="nav-link fw-bold" href="perfil.html">Mi Perfil</a>`;
  // Insertarlo antes del login/logout
  const loginLi = document.querySelector('.nav-item-login');
  navList.insertBefore(perfilItem, loginLi);
}


  // Mostrar u ocultar enlaces de admin
  if (!rol || rol !== 'admin') {
    adminLinks.forEach(link => link.style.display = 'none');
  } else {
    adminLinks.forEach(link => link.style.display = 'block');
  }

  // Página actual
  let path = window.location.pathname.split('/').pop() || 'index.html';
  path = path.toLowerCase();

  const PUBLIC_PAGES = new Set(['index.html', 'institucional.html', 'contacto.html', 'login.html', 'turno.html']);
  const ADMIN_PAGES  = new Set(['panelcontrol.html', 'altamedicos.html']);

  // Si no hay usuario logueado y la página no es pública, redirigir al login
  if (!usuario && !PUBLIC_PAGES.has(path)) {
    window.location.href = 'login.html';
    return;
  }

  // Si la página es de admin y el rol no es admin, redirigir al login
  if (ADMIN_PAGES.has(path) && rol !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  // Actualizar ítem del menú (Login / Cerrar sesión)
  if (usuario && loginItem) {
    loginItem.innerHTML = `<a href="#" id="cerrarSesionBtn" class="nav-link fw-bold text-white">Cerrar sesión</a>`;
  } else if (!usuario && loginItem) {
    loginItem.innerHTML = `<a class="nav-link fw-bold" href="login.html">Login</a>`;
  }

  // ============================
  // CERRAR SESIÓN
  // ============================
  const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const result = await Swal.fire({
        title: '¿Cerrar sesión?',
        text: 'Se cerrará tu sesión actual.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        // Eliminar datos de sesión (temporal y persistente)
        sessionStorage.clear();
        localStorage.removeItem('usuarioLogueado');
        localStorage.removeItem('rolUsuario');
        localStorage.removeItem('usuario');
        localStorage.removeItem('accessToken');

        await Swal.fire({
          title: 'Sesión cerrada',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        window.location.href = 'index.html';
      }
    });
  }
});
