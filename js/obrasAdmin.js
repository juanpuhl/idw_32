// ============================
// PANEL ADMIN - OBRAS SOCIALES
// ============================

document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.querySelector('#tablaObras tbody');
  const btnNueva = document.getElementById('btnNuevaObra');
  const modalObra = new bootstrap.Modal(document.getElementById('modalObra'));
  const formObra = document.getElementById('formObraSocial');

  let obras = JSON.parse(localStorage.getItem('obrasSociales')) || [];

  // ============================
  // RENDER TABLA
  // ============================
  function renderTabla() {
    tablaBody.innerHTML = '';
    if (obras.length === 0) {
      tablaBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay obras sociales cargadas.</td></tr>`;
      return;
    }

    obras.forEach((o, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="text-center">
          <img src="${o.logo || 'img/obras/otro.png'}" width="60" height="60" class="rounded shadow-sm">
        </td>
        <td>${o.nombre}</td>
        <td>${o.descripcion || '-'}</td>
        <td>
          <span class="badge ${o.activa ? 'bg-success' : 'bg-secondary'}">
            ${o.activa ? 'Activa' : 'Inactiva'}
          </span>
        </td>
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
  // NUEVA OBRA
  // ============================
  btnNueva.addEventListener('click', () => {
    formObra.reset();
    document.getElementById('obraIndex').value = '';
    document.getElementById('modalObraLabel').textContent = 'Nueva Obra Social';
    modalObra.show();
  });

  // ============================
  // GUARDAR (CREAR / EDITAR)
  // ============================
  formObra.addEventListener('submit', (e) => {
    e.preventDefault();
    const index = document.getElementById('obraIndex').value;

    const obra = {
      id: index === '' ? Date.now() : obras[index].id,
      nombre: document.getElementById('nombre').value.trim(),
      descripcion: document.getElementById('descripcion').value.trim(),
      logo: document.getElementById('logo').value.trim(),
      activa: document.getElementById('activa').checked
    };

    if (index === '') obras.push(obra);
    else obras[index] = obra;

    localStorage.setItem('obrasSociales', JSON.stringify(obras));
    renderTabla();
    modalObra.hide();

    Swal.fire({
      icon: 'success',
      title: 'Guardado',
      text: 'La obra social fue guardada correctamente.',
      timer: 1500,
      showConfirmButton: false
    });
  });

  // ============================
  // EDITAR
  // ============================
  tablaBody.addEventListener('click', (e) => {
    if (e.target.closest('.btn-editar')) {
      const i = e.target.closest('.btn-editar').dataset.index;
      const o = obras[i];

      document.getElementById('obraIndex').value = i;
      document.getElementById('nombre').value = o.nombre;
      document.getElementById('descripcion').value = o.descripcion;
      document.getElementById('logo').value = o.logo;
      document.getElementById('activa').checked = o.activa;
      document.getElementById('modalObraLabel').textContent = 'Editar Obra Social';
      modalObra.show();
    }
  });

  // ============================
  // ELIMINAR
  // ============================
  tablaBody.addEventListener('click', async (e) => {
    if (e.target.closest('.btn-borrar')) {
      const i = e.target.closest('.btn-borrar').dataset.index;
      const o = obras[i];
      const res = await Swal.fire({
        title: '¿Eliminar obra social?',
        text: `Se eliminará ${o.nombre}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
      if (res.isConfirmed) {
        obras.splice(i, 1);
        localStorage.setItem('obrasSociales', JSON.stringify(obras));
        renderTabla();
        Swal.fire({
          icon: 'success',
          title: 'Eliminada',
          timer: 1300,
          showConfirmButton: false
        });
      }
    }
  });

  renderTabla();
});
