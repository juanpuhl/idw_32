// ============================
// GESTIÓN DE TURNOS - USUARIO
// ============================

document.addEventListener("DOMContentLoaded", () => {

  // --- Elementos del DOM ---
  const form = document.getElementById("formTurno");
  const especialidadSelect = document.getElementById("especialidad");
  const doctorSelect = document.getElementById("doctor");
  const fechaInput = document.getElementById("fechaTurno");
  const fechaHelp = document.getElementById("fechaHelp");
  const horarioSelect = document.getElementById("horarioTurno");

  // --- Datos ---
  const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
  const usuarioSesion = JSON.parse(sessionStorage.getItem("usuario"));
  const usernameSesion = sessionStorage.getItem("usuarioLogueado");
  const doctorSeleccionado = JSON.parse(sessionStorage.getItem("doctorSeleccionado"));

  // --- Obras sociales ---
  renderObrasSocialesSelect("obraSocial");

  // ============================
  // FUNCIONES AUXILIARES
  // ============================
  function clearDoctorArea() {
    doctorSelect.innerHTML = '<option value="">Seleccione una especialidad primero</option>';
    fechaInput.value = "";
    fechaHelp.textContent = "";
    horarioSelect.innerHTML = '<option value="">Seleccione un médico</option>';
  }

  function capitalizarDia(dia) {
    return dia ? dia.charAt(0).toUpperCase() + dia.slice(1).toLowerCase() : dia;
  }

  function weekdayNameFromDateStr(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("es-AR", { weekday: "long" });
  }

  function autocompletarUsuario() {
    if (!usuarioSesion) return;
    document.getElementById("nombreApellido").value = `${usuarioSesion.firstName} ${usuarioSesion.lastName}`;
    document.getElementById("DNI").value = usuarioSesion.id;
    document.getElementById("email").value = usuarioSesion.email;
    document.getElementById("telefono").value = usuarioSesion.phone;
  }

  function autocompletarDoctor(doc) {
    if (!doc) return;
    especialidadSelect.value = doc.especialidad || "";
    doctorSelect.innerHTML = `<option value="${doc.nombre}" selected>${doc.nombre} — Matrícula ${doc.matricula}</option>`;
    if (doc.horarios) {
      const diasAtencion = doc.horarios.map(h => capitalizarDia(h.dia));
      fechaHelp.textContent = `Este médico atiende: ${diasAtencion.join(", ")}.`;
    }
    sessionStorage.removeItem("doctorSeleccionado");
  }

  // ============================
  // INICIALIZACIÓN
  // ============================
  clearDoctorArea();
  autocompletarUsuario();

  if (doctorSeleccionado) autocompletarDoctor(doctorSeleccionado);

  // ============================
  // CAMBIO DE ESPECIALIDAD - CARGA MÉDICOS
  // ============================
  especialidadSelect.addEventListener("change", () => {
    clearDoctorArea();
    const esp = especialidadSelect.value;
    if (!esp) return;

    const filtrados = medicos.filter(m => (m.especialidad || "").toLowerCase() === esp.toLowerCase());
    if (filtrados.length === 0) {
      doctorSelect.innerHTML = "<option>No hay médicos para esta especialidad</option>";
      return;
    }

    doctorSelect.innerHTML = filtrados.map(m =>
      `<option value="${m.nombre}">${m.nombre} — Matrícula ${m.matricula}</option>`
    ).join('');
  });

  // ============================
  // CAMBIO DE MÉDICO - MOSTRAR DÍAS DISPONIBLES
  // ============================
  doctorSelect.addEventListener("change", () => {
    fechaInput.value = "";
    horarioSelect.innerHTML = '<option value="">Seleccione un horario</option>';
    const nombreDoc = doctorSelect.value;
    if (!nombreDoc) return;

    const doctor = medicos.find(m => m.nombre === nombreDoc);
    if (!doctor) return;

    if (!doctor.horarios || doctor.horarios.length === 0) {
      doctor.horarios = [
        { dia: "Lunes", horas: ["08:00 - 12:00"] },
        { dia: "Martes", horas: ["08:00 - 12:00"] },
        { dia: "Miércoles", horas: ["08:00 - 12:00"] },
        { dia: "Jueves", horas: ["08:00 - 12:00"] },
        { dia: "Viernes", horas: ["08:00 - 12:00"] }
      ];
    }

    const diasAtencion = doctor.horarios.map(h => capitalizarDia(h.dia));
    fechaHelp.textContent = `Atiende: ${diasAtencion.join(", ")}. Seleccioná una fecha válida.`;
  });

  // ============================
  // CAMBIO DE FECHA- MOSTRAR HORARIOS DISPONIBLES
  // ============================
  fechaInput.addEventListener("change", () => {
    horarioSelect.innerHTML = '<option value="">Seleccionar horario</option>';
    const fecha = fechaInput.value;
    if (!fecha) return;

    const nombreDoc = doctorSelect.value;
    const doctor = medicos.find(m => m.nombre === nombreDoc);
    if (Array.isArray(doctor.horarios)) {
  doctor.horarios = doctor.horarios.map(h => {
    if (h.horas && Array.isArray(h.horas)) return h;
    if (h.horaInicio && h.horaFin) {
      return { ...h, horas: [`${h.horaInicio} - ${h.horaFin}`] };
    }
    return h;
  });
}
    if (!doctor) return;

    const diaSeleccionado = weekdayNameFromDateStr(fecha).toLowerCase();
    const bloque = doctor.horarios.find(h => h.dia.toLowerCase() === diaSeleccionado);

    if (!bloque) {
      Swal.fire({
        icon: "warning",
        title: "Día no disponible",
        text: `El médico no atiende ese día. Días disponibles: ${doctor.horarios.map(h => capitalizarDia(h.dia)).join(", ")}.`
      });
      fechaInput.value = "";
      return;
    }

    bloque.horas.forEach(rango => {
      const [inicio, fin] = rango.split(" - ");
      let [hora, min] = inicio.split(":").map(Number);
      const [horaFin, minFin] = fin.split(":").map(Number);
      while (hora < horaFin || (hora === horaFin && min < minFin)) {
        const horaStr = `${String(hora).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
        horarioSelect.insertAdjacentHTML("beforeend", `<option value="${horaStr}">${horaStr}</option>`);
        min += 30;
        if (min >= 60) { min -= 60; hora += 1; }
      }
    });
  });

  // ============================
  // GUARDAR TURNO
  // ============================
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const turno = {
      username: usuarioSesion ? usernameSesion : "invitado",
      nombreApellido: document.getElementById("nombreApellido").value.trim(),
      especialidad: especialidadSelect.value,
      medico: doctorSelect.value,
      fecha: fechaInput.value,
      horario: horarioSelect.value,
      dni: document.getElementById("DNI").value.trim(),
      obrasSociales: document.getElementById("obraSocial").value,
      email: document.getElementById("email").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
  valorConsulta: (() => {
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    const encontrado = medicos.find(m => m.nombre === doctorSelect.value);
    return encontrado ? Number(encontrado.valorConsulta) || 0 : 0;
     })()
    };

    if (Object.values(turno).some(v => !v)) {
      Swal.fire({ icon: "warning", title: "Faltan datos", text: "Completá todos los campos." });
      return;
    }

    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    turnos.push(turno);
    localStorage.setItem("turnos", JSON.stringify(turnos));

    Swal.fire({
      icon: "success",
      title: "Turno solicitado",
      text: "El turno fue registrado correctamente.",
      timer: 1800,
      showConfirmButton: false
    });

    form.reset();
    clearDoctorArea();
    autocompletarUsuario();
  });

});
