document.addEventListener("DOMContentLoaded", () => {
  const especialidadSelect = document.getElementById("especialidad");
  const doctorSelect = document.getElementById("doctor");
  const fechaInput = document.getElementById("fechaTurno");
  const fechaHelp = document.getElementById("fechaHelp");
  const horarioSelect = document.getElementById("horarioTurno");
  const form = document.getElementById("formTurno");
  const listaTurnosTbody = document.querySelector("#listaTurnos tbody");
  const listaTurnosSection = document.querySelector("#listaTurnos").closest("section");

  // Obtener médicos desde localStorage
  const medicos = JSON.parse(localStorage.getItem("medicos")) || [];

  // Obtener sesión si existe
  const usuarioSesion = JSON.parse(sessionStorage.getItem("usuario"));
  const usernameSesion = sessionStorage.getItem("usuarioLogueado");

  // Obtener doctor seleccionado desde index
  const doctorSeleccionado = JSON.parse(sessionStorage.getItem("doctorSeleccionado"));

  // --- Funciones auxiliares ---
  function clearDoctorArea() {
    doctorSelect.innerHTML = '<option value="">Seleccione una especialidad primero</option>';
    fechaInput.value = "";
    fechaInput.min = "";
    fechaHelp.textContent = "";
    horarioSelect.innerHTML = '<option value="">Seleccione un médico</option>';
  }

  function capitalizarDia(dia) {
    if (!dia) return dia;
    return dia.charAt(0).toUpperCase() + dia.slice(1).toLowerCase();
  }

  function weekdayNameFromDateStr(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("es-AR", { weekday: "long" });
  }

  function autocompletarUsuario() {
    if (usuarioSesion) {
      document.getElementById("nombreApellido").value = `${usuarioSesion.firstName} ${usuarioSesion.lastName}`;
      document.getElementById("DNI").value = usuarioSesion.id;
      document.getElementById("email").value = usuarioSesion.email;
      document.getElementById("telefono").value = usuarioSesion.phone;
    }
  }

  function autocompletarDoctor(doc) {
    if (!doc) return;

    especialidadSelect.value = doc.especialidad || "";
    
    // Poblar select de doctor
    doctorSelect.innerHTML = `<option value="${doc.nombre}" selected>${doc.nombre} — Matrícula ${doc.matricula}</option>`;
    
    // Mostrar días disponibles
    if (doc.horarios) {
      const diasAtencion = doc.horarios.map(h => capitalizarDia(h.dia));
      fechaHelp.textContent = `Este médico atiende: ${diasAtencion.join(", ")}. Seleccioná una fecha que caiga en esos días.`;
    }

    sessionStorage.removeItem("doctorSeleccionado"); // limpiar después de autocompletar
  }

  function esDesdeIndex() {
    const params = new URLSearchParams(window.location.search);
    return params.get("desde") === "index";
  }

  // --- Inicializar ---
  clearDoctorArea();
  autocompletarUsuario();

  // Autocompletar doctor solo si venís desde index
  if (doctorSeleccionado && esDesdeIndex()) {
    autocompletarDoctor(doctorSeleccionado);
  }

  // --- Al cambiar especialidad: poblar médicos ---
  especialidadSelect.addEventListener("change", () => {
    clearDoctorArea();
    const esp = especialidadSelect.value;
    doctorSelect.innerHTML = "<option value=''>Seleccionar médico</option>";

    if (!esp) return;

    const filtrados = medicos.filter(m => (m.especialidad || "").toLowerCase() === esp.toLowerCase());
    filtrados.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m.nombre;
      opt.textContent = `${m.nombre} — Matrícula ${m.matricula}`;
      doctorSelect.appendChild(opt);
    });

    if (filtrados.length === 0) {
      doctorSelect.innerHTML = "<option value=''>No hay médicos para esta especialidad</option>";
    }
  });

  // --- Al cambiar doctor: mostrar días disponibles ---
  doctorSelect.addEventListener("change", () => {
    fechaInput.value = "";
    fechaHelp.textContent = "";
    horarioSelect.innerHTML = '<option value="">Seleccione un médico</option>';

    const nombreDoc = doctorSelect.value;
    if (!nombreDoc) return;

    const doctor = medicos.find(m => m.nombre === nombreDoc);
    if (!doctor) return;

    const diasAtencion = doctor.horarios.map(h => capitalizarDia(h.dia));
    fechaHelp.textContent = `Este médico atiende: ${diasAtencion.join(", ")}. Seleccioná una fecha que caiga en esos días.`;

    const hoy = new Date();
    fechaInput.min = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
  });

  // --- Al cambiar fecha: mostrar horarios disponibles ---
  fechaInput.addEventListener("change", () => {
    horarioSelect.innerHTML = '<option value="">Seleccionar horario</option>';
    const fecha = fechaInput.value;
    if (!fecha) return;

    const nombreDoc = doctorSelect.value;
    const doctor = medicos.find(m => m.nombre === nombreDoc);
    if (!doctor || !Array.isArray(doctor.horarios)) return;

    const diaSeleccionado = weekdayNameFromDateStr(fecha).toLowerCase();
    const bloque = doctor.horarios.find(h => h.dia.toLowerCase() === diaSeleccionado);

    if (!bloque) {
      Swal.fire({
        icon: "warning",
        title: "Fecha no disponible",
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
        const opt = document.createElement("option");
        opt.value = horaStr;
        opt.textContent = horaStr;
        horarioSelect.appendChild(opt);

        min += 30;
        if (min >= 60) {
          min -= 60;
          hora += 1;
        }
      }
    });
  });

  // --- Guardar turno ---
  form.addEventListener("submit", e => {
    e.preventDefault();

    const nombreApellido = document.getElementById("nombreApellido").value.trim();
    const especialidad = especialidadSelect.value;
    const medico = doctorSelect.value;
    const fecha = fechaInput.value;
    const horario = horarioSelect.value;
    const dni = document.getElementById("DNI").value.trim();
    const obrasSociales = document.getElementById("obraSocial").value;
    const email = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    if (!nombreApellido || !especialidad || !medico || !fecha || !horario || !dni || !email || !telefono) {
      Swal.fire({ icon: "warning", title: "Faltan datos", text: "Completá todos los campos." });
      return;
    }

    const turno = {
      username: usuarioSesion ? usernameSesion : null,
      nombreApellido,
      especialidad,
      medico,
      fecha,
      horario,
      dni,
      obrasSociales,
      email,
      telefono
    };

    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    turnos.push(turno);
    localStorage.setItem("turnos", JSON.stringify(turnos));

    Swal.fire({ icon: "success", title: "Turno solicitado", text: "El turno se guardó correctamente.", timer: 1400, showConfirmButton: false });

    form.reset();
    clearDoctorArea();
    autocompletarUsuario();
    cargarTablaTurnos();
  });

  // --- Mostrar tabla de turnos solo para usuario logueado ---
  function cargarTablaTurnos() {
    if (!usuarioSesion) {
      listaTurnosSection.style.display = "none";
      return;
    }

    listaTurnosSection.style.display = "block";

    listaTurnosTbody.innerHTML = "";
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    const turnosUsuario = turnos.filter(t => t.username === usernameSesion);

    turnosUsuario.forEach(t => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${t.nombreApellido}</td>
        <td>${t.especialidad}</td>
        <td>${t.medico}</td>
        <td>${t.dni}</td>
        <td>${t.horario}</td>
        <td>${t.fecha}</td>
        <td>${t.obrasSociales}</td>
        <td>${t.email}</td>
        <td>${t.telefono}</td>
      `;
      listaTurnosTbody.appendChild(tr);
    });
  }

  // Inicializar tabla de turnos
  cargarTablaTurnos();
});
