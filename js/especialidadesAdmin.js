
// PANEL ADMIN - ESPECIALIDADES


document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.querySelector('#tablaEspecialidades tbody');
  const btnNueva = document.getElementById('btnNuevaEsp');
  const formEsp = document.getElementById('formEsp');
  const modalEsp = new bootstrap.Modal(document.getElementById('modalEsp'));
  let especialidades = getEspecialidades();

  // --- Render tabla ---
  function renderTabla() {
    tablaBody.innerHTML = "";
    if (especialidades.length === 0) {
      tablaBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No hay especialidades registradas.</td></tr>`;
      return;
    }

    especialidades.forEach((e, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${e.nombre}</td>
        <td>${e.descripcion || '-'}</td>
        <td><span class="badge ${e.activa ? 'bg-success' : 'bg-secondary'}">${e.activa ? 'Activa' : 'Inactiva'}</span></td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-1 btn-editar" data-index="${i}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger btn-borrar" data-index="${i}"><i class="bi bi-trash"></i></button>
        </td>
      `;
      tablaBody.appendChild(tr);
    });
  }

  // --- Nueva especialidad ---
  btnNueva.addEventListener('click', () => {
    formEsp.reset();
    document.getElementById('espIndex').value = '';
    document.getElementById('modalEspLabel').textContent = 'Nueva Especialidad';
    modalEsp.show();
  });

  // --- Guardar (crear o editar) ---
  formEsp.addEventListener('submit', e => {
    e.preventDefault();
    const index = document.getElementById('espIndex').value;

    const esp = {
      id: index === '' ? Date.now() : especialidades[index].id,
      nombre: document.getElementById('nombre').value.trim(),
      descripcion: document.getElementById('descripcion').value.trim(),
      activa: document.getElementById('activa').checked
    };

    if (index === '') especialidades.push(esp);
    else especialidades[index] = esp;

    localStorage.setItem('especialidades', JSON.stringify(especialidades));
    renderTabla();
    modalEsp.hide();

    Swal.fire({
      icon: 'success',
      title: 'Guardado',
      text: 'La especialidad fue guardada correctamente.',
      timer: 1500,
      showConfirmButton: false
    });
  });

  // --- Editar ---
  tablaBody.addEventListener('click', e => {
    if (e.target.closest('.btn-editar')) {
      const i = e.target.closest('.btn-editar').dataset.index;
      const esp = especialidades[i];
      document.getElementById('espIndex').value = i;
      document.getElementById('nombre').value = esp.nombre;
      document.getElementById('descripcion').value = esp.descripcion;
      document.getElementById('activa').checked = esp.activa;
      document.getElementById('modalEspLabel').textContent = 'Editar Especialidad';
      modalEsp.show();
    }
  });

  // --- Eliminar ---
  tablaBody.addEventListener('click', async e => {
    if (e.target.closest('.btn-borrar')) {
      const i = e.target.closest('.btn-borrar').dataset.index;
      const esp = especialidades[i];
      const res = await Swal.fire({
        title: '¿Eliminar especialidad?',
        text: `Se eliminará "${esp.nombre}".`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
      if (res.isConfirmed) {
        especialidades.splice(i, 1);
        localStorage.setItem('especialidades', JSON.stringify(especialidades));
        renderTabla();
        Swal.fire({ icon: 'success', title: 'Eliminada', timer: 1300, showConfirmButton: false });
      }
    }
  });

  renderTabla();
});
