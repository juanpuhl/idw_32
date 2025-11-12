// ============================
// TURNOS - PANEL ADMINISTRADOR
// ============================

document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.querySelector('#tablaTurnos tbody');
  const btnNuevoTurno = document.getElementById('btnNuevoTurno');
  const modalTurno = new bootstrap.Modal(document.getElementById('modalNuevoTurno'));
  const formNuevoTurno = document.getElementById('formNuevoTurno');

  let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
  const medicos = JSON.parse(localStorage.getItem('medicos')) || [];

  // ============================
  // POBLAR SELECTS EN EL MODAL
  // ============================
  const selectEspecialidad = document.getElementById('especialidad');
  const selectMedico = document.getElementById('medico');

  const especialidadesUnicas = [...new Set(medicos.map(m => m.especialidad))];
  especialidadesUnicas.forEach(esp => {
    const opt = document.createElement('option');
    opt.textContent = esp;
    selectEspecialidad.appendChild(opt);
  });

  selectEspecialidad.addEventListener('change', () => {
    const esp = selectEspecialidad.value;
    selectMedico.innerHTML = '<option value="">Seleccione un médico</option>';
    const filtrados = medicos.filter(m => m.especialidad === esp);
    filtrados.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.nombre;
      opt.textContent = `${m.nombre} — Matrícula ${m.matricula}`;
      selectMedico.appendChild(opt);
    });
  });

  // ============================
  // RENDERIZAR TABLA DE TURNOS
  // ============================
  function renderTabla() {
    tablaBody.innerHTML = '';
    if (turnos.length === 0) {
      tablaBody.innerHTML = `<tr><td colspan="10" class="text-center text-muted">No hay turnos registrados.</td></tr>`;
      return;
    }

    turnos.forEach((t, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.nombreApellido}</td>
        <td>${t.especialidad}</td>
        <td>${t.medico}</td>
        <td>${t.fecha}</td>
        <td>${t.horario}</td>
        <td>${t.dni}</td>
        <td>${t.obrasSociales}</td>
        <td>${t.email}</td>
        <td>${t.telefono}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-1 btn-editar" data-index="${i}">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-danger btn-borrar" data-index="${i}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      tablaBody.appendChild(tr);
    });
  }

  // ============================
  // NUEVO TURNO
  // ============================
  btnNuevoTurno.addEventListener('click', () => {
    formNuevoTurno.reset();
    modalTurno.show();
  });

  formNuevoTurno.addEventListener('submit', e => {
    e.preventDefault();

    const nuevoTurno = {
      nombreApellido: document.getElementById('nombreApellido').value.trim(),
      dni: document.getElementById('dni').value.trim(),
      especialidad: selectEspecialidad.value,
      medico: selectMedico.value,
      fecha: document.getElementById('fecha').value,
      horario: document.getElementById('horario').value,
      obrasSociales: document.getElementById('obraSocial').value,
      email: document.getElementById('email').value,
      telefono: document.getElementById('telefono').value,
      username: 'admin' // se guarda quién lo cargó
    };

    turnos.push(nuevoTurno);
    localStorage.setItem('turnos', JSON.stringify(turnos));

    modalTurno.hide();
    renderTabla();

    Swal.fire({
      icon: 'success',
      title: 'Turno creado',
      text: 'El turno se agregó correctamente.',
      timer: 1500,
      showConfirmButton: false
    });
  });

  // ============================
  // ELIMINAR TURNO
  // ============================
  tablaBody.addEventListener('click', async e => {
    if (e.target.closest('.btn-borrar')) {
      const index = e.target.closest('.btn-borrar').dataset.index;
      const turno = turnos[index];
      const res = await Swal.fire({
        title: '¿Eliminar turno?',
        text: `¿Deseás eliminar el turno de ${turno.nombreApellido} con ${turno.medico}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
      if (res.isConfirmed) {
        turnos.splice(index, 1);
        localStorage.setItem('turnos', JSON.stringify(turnos));
        renderTabla();
        Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1200, showConfirmButton: false });
      }
    }
  });

  // (Opcional) editar turno
  tablaBody.addEventListener('click', (e) => {
    if (e.target.closest('.btn-editar')) {
      Swal.fire('Función en desarrollo', 'La edición de turnos se agregará luego.', 'info');
    }
  });

  renderTabla();
});
