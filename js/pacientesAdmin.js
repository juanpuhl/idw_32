// ============================
// PACIENTES - PANEL ADMINISTRADOR
// ============================

document.addEventListener('DOMContentLoaded', async () => {
  const tablaBody = document.querySelector('#tablaPacientes tbody');
  const btnNuevo = document.getElementById('btnNuevoPaciente');
  const modalPaciente = new bootstrap.Modal(document.getElementById('modalPaciente'));
  const formPaciente = document.getElementById('formPaciente');
  let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

  // ============================
  // CARGA INICIAL DESDE API (si no hay datos locales)
  // ============================
  if (pacientes.length === 0) {
    try {
      const res = await fetch('https://dummyjson.com/users?limit=20');
      const data = await res.json();
      pacientes = data.users.map(u => ({
        nombre: u.firstName,
        apellido: u.lastName,
        edad: u.age,
        email: u.email,
        telefono: u.phone,
        usuario: u.username,
        password: "1234", // valor genérico para los importados
        role: "usuario"
      }));
      localStorage.setItem('pacientes', JSON.stringify(pacientes));
    } catch (err) {
      console.error('Error cargando API DummyJSON:', err);
    }
  }

  // ============================
  // RENDERIZAR TABLA
  // ============================
  function renderTabla() {
    tablaBody.innerHTML = '';
    if (pacientes.length === 0) {
      tablaBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No hay pacientes registrados.</td></tr>`;
      return;
    }
    pacientes.forEach((p, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.nombre}</td>
        <td>${p.apellido}</td>
        <td>${p.edad}</td>
        <td>${p.email}</td>
        <td>${p.telefono}</td>
        <td>${p.usuario}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-1 btn-editar" data-index="${i}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger btn-borrar" data-index="${i}"><i class="bi bi-trash"></i></button>
        </td>`;
      tablaBody.appendChild(tr);
    });
  }

  // ============================
  // NUEVO PACIENTE
  // ============================
  btnNuevo.addEventListener('click', () => {
    formPaciente.reset();
    document.getElementById('pacienteIndex').value = '';
    document.getElementById('modalPacienteLabel').textContent = 'Nuevo Paciente';
    modalPaciente.show();
  });

  formPaciente.addEventListener('submit', (e) => {
    e.preventDefault();
    const index = document.getElementById('pacienteIndex').value;

    const paciente = {
      nombre: document.getElementById('nombre').value.trim(),
      apellido: document.getElementById('apellido').value.trim(),
      edad: parseInt(document.getElementById('edad').value),
      email: document.getElementById('email').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      usuario: document.getElementById('usuarioInput').value.trim(),
      password: document.getElementById('passwordInput').value.trim(),
      role: "usuario"
    };

    if (index === '') {
      pacientes.push(paciente);
    } else {
      pacientes[index] = paciente;
    }

    localStorage.setItem('pacientes', JSON.stringify(pacientes));

    // ============================
    // Sincronizar también con "users" (para login local)
    // ============================
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === paciente.usuario);

    const userCompatible = {
      id: Date.now(),
      firstName: paciente.nombre,
      lastName: paciente.apellido,
      age: paciente.edad,
      email: paciente.email,
      phone: paciente.telefono,
      username: paciente.usuario,
      password: paciente.password,
      role: "usuario"
    };

    if (userIndex >= 0) users[userIndex] = userCompatible;
    else users.push(userCompatible);

    localStorage.setItem('users', JSON.stringify(users));
    // ============================

    renderTabla();
    modalPaciente.hide();

    Swal.fire({
      icon: 'success',
      title: 'Paciente guardado',
      text: 'Los datos fueron guardados correctamente.',
      timer: 1500,
      showConfirmButton: false
    });
  });

  // ============================
  // EDITAR PACIENTE
  // ============================
  tablaBody.addEventListener('click', (e) => {
    if (e.target.closest('.btn-editar')) {
      const i = e.target.closest('.btn-editar').dataset.index;
      const p = pacientes[i];
      document.getElementById('pacienteIndex').value = i;
      document.getElementById('nombre').value = p.nombre;
      document.getElementById('apellido').value = p.apellido;
      document.getElementById('edad').value = p.edad;
      document.getElementById('email').value = p.email;
      document.getElementById('telefono').value = p.telefono;
      document.getElementById('usuarioInput').value = p.usuario;
      document.getElementById('passwordInput').value = p.password || '';
      document.getElementById('modalPacienteLabel').textContent = 'Editar Paciente';
      modalPaciente.show();
    }
  });

  // ============================
  // ELIMINAR PACIENTE
  // ============================
  tablaBody.addEventListener('click', async (e) => {
    if (e.target.closest('.btn-borrar')) {
      const i = e.target.closest('.btn-borrar').dataset.index;
      const p = pacientes[i];
      const res = await Swal.fire({
        title: '¿Eliminar paciente?',
        text: `Se eliminará a ${p.nombre} ${p.apellido}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
      if (res.isConfirmed) {
        pacientes.splice(i, 1);
        localStorage.setItem('pacientes', JSON.stringify(pacientes));

        // Quitar también de "users" si existe
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const indexUser = users.findIndex(u => u.username === p.usuario);
        if (indexUser >= 0) {
          users.splice(indexUser, 1);
          localStorage.setItem('users', JSON.stringify(users));
        }

        renderTabla();
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El paciente fue eliminado correctamente.',
          timer: 1300,
          showConfirmButton: false
        });
      }
    }
  });

  renderTabla();
});
