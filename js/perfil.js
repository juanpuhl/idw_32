// ============================
// PERFIL DE USUARIO - CLÍNICA IDW
// ============================

document.addEventListener('DOMContentLoaded', () => {
  const userData = sessionStorage.getItem('usuario') || localStorage.getItem('usuario');
  const usernameSesion = sessionStorage.getItem('usuarioLogueado');

  if (!userData || !usernameSesion) {
    Swal.fire({
      icon: 'info',
      title: 'Iniciá sesión',
      text: 'Debes iniciar sesión para ver tu perfil.',
      confirmButtonText: 'Ir al login'
    }).then(() => window.location.href = 'login.html');
    return;
  }

  const user = JSON.parse(userData);
  const datosList = document.getElementById('datosUsuario');
  const turnosBody = document.getElementById('tablaTurnosBody');

  // ============================
  // MOSTRAR DATOS DEL USUARIO
  // ============================
  datosList.innerHTML = `
    <li class="list-group-item"><b>Nombre:</b> ${user.firstName} ${user.lastName}</li>
    <li class="list-group-item"><b>Usuario:</b> ${user.username}</li>
    <li class="list-group-item"><b>Email:</b> ${user.email}</li>
    <li class="list-group-item"><b>Teléfono:</b> ${user.phone || '-'}</li>
    <li class="list-group-item"><b>Rol:</b> ${user.role || 'usuario'}</li>
  `;

  // ============================
  // CARGAR TURNOS DEL USUARIO
  // ============================
  const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
  const misTurnos = turnos.filter(t => t.username === usernameSesion);

  if (misTurnos.length === 0) {
    turnosBody.innerHTML = `
      <tr><td colspan="6" class="text-center text-muted">No tienes turnos registrados.</td></tr>
    `;
    return;
  }

  misTurnos.forEach((t, i) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${i + 1}</td>
      <td>${t.medico}</td>
      <td>${t.especialidad}</td>
      <td>${t.fecha} ${t.horario}</td>
      <td>${t.obrasSociales}</td>
      <td class="text-end fw-semibold text-success">
        $${Number(t.valorConsulta || 0).toLocaleString('es-AR')}
      </td>
    `;
    turnosBody.appendChild(fila);
  });
});

// ============================
// CERRAR SESIÓN DIRECTO DESDE PERFIL
// ============================
function cerrarSesion() {
  Swal.fire({
    title: "¿Cerrar sesión?",
    text: "Tu sesión actual se cerrará.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, cerrar sesión",
    cancelButtonText: "Cancelar"
  }).then(result => {
    if (result.isConfirmed) {
      sessionStorage.clear();
      localStorage.removeItem("usuario");
      Swal.fire({
        icon: "success",
        title: "Sesión cerrada",
        timer: 1500,
        showConfirmButton: false
      }).then(() => window.location.href = "index.html");
    }
  });
}
