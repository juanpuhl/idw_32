document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("altaMedicoForm");
  const tablaMedicos = document.getElementById("tablaMedicos").querySelector("tbody");
  const listaHorarios = document.getElementById("listaHorarios");

  const diaSelect = document.getElementById("dia");
  const horaInicioInput = document.getElementById("horaInicio");
  const horaFinInput = document.getElementById("horaFin");
  const btnAgregarHorario = document.getElementById("agregarHorario");

  let horarios = [];

  // Actualiza la lista de horarios
  function actualizarListaHorarios() {
    listaHorarios.innerHTML = "";
    horarios.forEach((h, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <span><strong>${h.dia}:</strong> ${h.rango[0]} - ${h.rango[1]}</span>
        <button class="btn btn-sm btn-danger">Eliminar</button>
      `;
      li.querySelector("button").addEventListener("click", () => {
        horarios.splice(index, 1);
        actualizarListaHorarios();
      });
      listaHorarios.appendChild(li);
    });
  }

  // Agregar horario
  btnAgregarHorario.addEventListener("click", () => {
    const dia = diaSelect.value;
    const horaInicio = horaInicioInput.value;
    const horaFin = horaFinInput.value;

    if (!dia || !horaInicio || !horaFin) {
      Swal.fire({ icon: "warning", title: "Campos incompletos", text: "Debes seleccionar día, hora de inicio y hora de fin." });
      return;
    }

    if (horarios.some(h => h.dia === dia)) {
      Swal.fire({ icon: "warning", title: "Día duplicado", text: "Ya agregaste un horario para ese día." });
      return;
    }

    horarios.push({ dia, rango: [horaInicio, horaFin] });
    actualizarListaHorarios();
    horaInicioInput.value = "";
    horaFinInput.value = "";
  });

  // Cargar médicos
  function cargarMedicos() {
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    tablaMedicos.innerHTML = "";

    medicos.forEach((m, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${m.nombre || "-"}</td>
        <td>${m.especialidad || "-"}</td>
        <td>${m.matricula || "-"}</td>
        <td>${m.fechaAlta || "-"}</td>
        <td>${m.obrasSociales ? m.obrasSociales.join(", ") : "-"}</td>
        <td>${m.telefono || "-"}</td>
        <td>${m.email || "-"}</td>
        <td>
          <button class="btn btn-info btn-sm me-1 ver-btn" data-index="${index}"><i class="bi bi-eye"></i></button>
          <button class="btn btn-warning btn-sm me-1 editar-btn" data-index="${index}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-danger btn-sm eliminar-btn" data-index="${index}"><i class="bi bi-trash"></i></button>
        </td>
      `;
      tablaMedicos.appendChild(tr);
    });
  }

  // Delegación de eventos
  tablaMedicos.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const index = parseInt(btn.dataset.index);
    if (isNaN(index)) return;

    if (btn.classList.contains("ver-btn")) verMedico(index);
    if (btn.classList.contains("editar-btn")) editarMedico(index);
    if (btn.classList.contains("eliminar-btn")) confirmarEliminar(index);
  });

  // Confirmar antes de eliminar
  function confirmarEliminar(index) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al médico.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) eliminarMedico(index);
    });
  }

  function eliminarMedico(index) {
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    medicos.splice(index, 1);
    localStorage.setItem("medicos", JSON.stringify(medicos));
    cargarMedicos();
    Swal.fire("Eliminado", "El médico fue eliminado correctamente.", "success");
  }

  // Alta de médico
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const especialidad = document.getElementById("especialidad").value.trim();
    const matricula = document.getElementById("matricula").value.trim();
    const fechaAlta = document.getElementById("fechaAlta").value;
    const telefono = document.getElementById("telefono").value.trim();
    const email = document.getElementById("email").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const valorConsulta = parseFloat(document.getElementById("valorConsulta").value);
    const obrasSociales = Array.from(document.getElementById("obraSocial").selectedOptions).map(opt => opt.value);

    if (!nombre || !especialidad || !matricula || !fechaAlta || !telefono || !email || !descripcion || isNaN(valorConsulta)) {
      Swal.fire({ icon: "warning", title: "Campos incompletos", text: "Por favor completá todos los campos obligatorios." });
      return;
    }

    const medico = { nombre, especialidad, matricula, fechaAlta, obrasSociales, telefono, email, descripcion, valorConsulta, horarios };
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    medicos.push(medico);
    localStorage.setItem("medicos", JSON.stringify(medicos));

    Swal.fire({ icon: "success", title: "Médico dado de alta", showConfirmButton: false, timer: 1500 });
    form.reset();
    horarios = [];
    actualizarListaHorarios();
    cargarMedicos();
  });

  // Ver médico
  function verMedico(index) {
  const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
  const m = medicos[index];

  let horariosText = "-";
  if (Array.isArray(m.horarios) && m.horarios.length > 0) {
    horariosText = m.horarios.map(h => {
      if (h.rango && h.rango.length === 2) {
        return `<u>${h.dia}</u>: ${h.rango[0]} - ${h.rango[1]}`;
      } else {
        return `<u>${h.dia}</u>: Horario no definido`;
      }
    }).join("<br>");
  }

  Swal.fire({
    title: m.nombre || "-",
    html: `
      <p><b>Especialidad:</b> ${m.especialidad || "-"}</p>
      <p><b>Matrícula:</b> ${m.matricula || "-"}</p>
      <p><b>Descripción:</b> ${m.descripcion || "-"}</p>
      <p><b>Valor Consulta:</b> $${m.valorConsulta?.toFixed(2) || "-"}</p>
      <p><b>Horarios:</b><br>${horariosText}</p>
      <p><b>Obras Sociales:</b> ${m.obrasSociales?.join(", ") || "-"}</p>
      <p><b>Teléfono:</b> ${m.telefono || "-"}</p>
      <p><b>Email:</b> ${m.email || "-"}</p>
    `,
    icon: "info",
    confirmButtonText: "Cerrar"
  });
}


  // Editar médico
  function editarMedico(index) {
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    const m = medicos[index];

    Swal.fire({
      title: "Editar Médico",
      html: `
        <input id="swal-nombre" class="swal2-input" value="${m.nombre || ""}" placeholder="Nombre">
        <input id="swal-especialidad" class="swal2-input" value="${m.especialidad || ""}" placeholder="Especialidad">
        <input id="swal-matricula" class="swal2-input" value="${m.matricula || ""}" placeholder="Matrícula">
        <input id="swal-telefono" class="swal2-input" value="${m.telefono || ""}" placeholder="Teléfono">
        <input id="swal-email" class="swal2-input" value="${m.email || ""}" placeholder="Email">
        <input id="swal-descripcion" class="swal2-input" value="${m.descripcion || ""}" placeholder="Descripción">
        <input id="swal-valorConsulta" class="swal2-input" type="number" step="0.01" value="${m.valorConsulta || ""}" placeholder="Valor de consulta" style="color: rgba(0,0,0,0.4);">
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => ({
        nombre: document.getElementById("swal-nombre").value,
        especialidad: document.getElementById("swal-especialidad").value,
        matricula: document.getElementById("swal-matricula").value,
        telefono: document.getElementById("swal-telefono").value,
        email: document.getElementById("swal-email").value,
        descripcion: document.getElementById("swal-descripcion").value,
        valorConsulta: parseFloat(document.getElementById("swal-valorConsulta").value)
      })
    }).then(result => {
      if (result.isConfirmed) {
        medicos[index] = { ...m, ...result.value };
        localStorage.setItem("medicos", JSON.stringify(medicos));
        cargarMedicos();
        Swal.fire("Actualizado", "Los datos del médico fueron actualizados.", "success");
      }
    });
  }

  // Inicializar
  cargarMedicos();
});
