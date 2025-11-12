// INDEX.JS - CLÍNICA IDW
// Render de médicos + obras sociales

// ------------------------------------
// RENDER DEL CATÁLOGO DE MÉDICOS
// ------------------------------------
(function renderStaff() {
  const cont = document.getElementById('staffContainer');
  if (!cont) return;

  const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
  if (medicos.length === 0) {
    cont.innerHTML = `<p class="text-muted">No hay médicos registrados aún.</p>`;
    return;
  }

  const slice = medicos.slice(0, 8);
  cont.innerHTML = slice.map((m, index) => {
    // ✅ Usar directamente la fotoBase64 o mostrar un marcador vacío si no existe
    const foto = m.fotoBase64 || "img/medicos/default.png";

    const obrasTxt = Array.isArray(m.obrasSociales)
      ? m.obrasSociales.join(', ')
      : (m.obrasSociales || '-');

    const valorTxt = m.valorConsulta
      ? `$${Number(m.valorConsulta).toLocaleString('es-AR')}`
      : 'A confirmar';

    const horariosHTML = m.horarios && m.horarios.length
      ? `<ul class="list-unstyled mb-2 small text-secondary">${m.horarios
          .map(h => `<li>${h.dia}: ${h.horaInicio || ''} - ${h.horaFin || ''}</li>`)
          .join('')}</ul>`
      : `<p class="text-muted small">No hay horarios cargados</p>`;

    const descShort = (m.descripcion || '').length > 70
      ? m.descripcion.slice(0, 70) + '...'
      : m.descripcion || 'Sin descripción disponible';

    return `
      <div class="col">
        <div class="card h-100 shadow-sm border-0 rounded-4 staff-card" data-index="${index}">
          <img src="${foto}" class="card-img-top" alt="Foto ${m.nombre} ${m.apellido}">
          <div class="card-body text-center">
            <h3 class="h5 fw-bold mb-1">${m.apellido}, ${m.nombre}</h3>
            <p class="text-primary mb-1"><i class="bi bi-stethoscope"></i> ${m.especialidad}</p>
            <p class="text-secondary small mb-2">${descShort}</p>
            <p class="mb-1"><strong>Valor de consulta:</strong> ${valorTxt}</p>
            <div class="border-top pt-2 mt-2">
              <h6 class="fw-semibold mb-2"><i class="bi bi-clock"></i> Horarios</h6>
              ${horariosHTML}
            </div>
            <small class="text-muted d-block mt-2">Obras Sociales: ${obrasTxt}</small>

            <div class="mt-3">
              <button class="btn btn-success btn-sm sacar-turno-btn">
                <i class="bi bi-calendar-check"></i> Sacar Turno
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');

  // Evento del botón "Sacar turno"
  document.querySelectorAll('.sacar-turno-btn').forEach((btn, idx) => {
    btn.addEventListener('click', async () => {
      const medico = slice[idx];
      const userData = sessionStorage.getItem('usuario') || localStorage.getItem('usuario');
      let user = null;

      if (userData) {
        try { user = JSON.parse(userData); } catch { user = null; }
      }

      if (!user) {
        await Swal.fire({
          icon: 'info',
          title: 'Iniciá sesión',
          text: 'Debes iniciar sesión para reservar un turno.',
          confirmButtonText: 'Ir al login'
        });
        window.location.href = 'login.html';
        return;
      }

      // Guardar el médico y redirigir al turno
      sessionStorage.setItem('doctorSeleccionado', JSON.stringify(medico));
      window.location.href = 'turno.html?desde=index';
    });
  });
})();


// ------------------------------------
// RENDER DE OBRAS SOCIALES
// ------------------------------------
(function renderObrasSociales() {
  const cont = document.getElementById("listaObras");
  if (!cont) return;

  const obras = JSON.parse(localStorage.getItem("obrasSociales")) || [];

  if (obras.length === 0) {
    cont.innerHTML = `<p class="text-muted">No hay obras sociales registradas.</p>`;
    return;
  }

  const activas = obras.filter(o => o.activa);
  cont.innerHTML = activas.map(o => `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
      <div class="card flex-fill border-0 shadow-sm text-center">
        <div class="p-3">
          <img src="${o.logo || 'img/obras/otro.png'}"
               alt="${o.nombre}"
               class="img-fluid rounded mb-2"
               style="max-height:80px; object-fit:contain;">
          <h5 class="fw-bold mb-1">${o.nombre}</h5>
          <p class="text-muted small mb-0">${o.descripcion || 'Sin descripción disponible.'}</p>
        </div>
      </div>
    </div>
  `).join('');
})();
