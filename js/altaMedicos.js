// ==========================
// CARGA INICIAL DE MÉDICOS
// ==========================
let medicos = JSON.parse(localStorage.getItem("medicos")) || [];

const form = document.getElementById("altaMedicoForm");
const tablaBody = document.querySelector("#tablaMedicos tbody");
const listaHorarios = document.getElementById("listaHorarios");
const agregarHorarioBtn = document.getElementById("agregarHorario");

let horarios = [];
let editando = false;
let medicoEditandoIndex = -1;

// ==========================
// FUNCIONES DE HORARIOS
// ==========================
agregarHorarioBtn.addEventListener("click", () => {
    const dia = document.getElementById("dia").value;
    const horaInicio = document.getElementById("horaInicio").value;
    const horaFin = document.getElementById("horaFin").value;

    if (!horaInicio || !horaFin) {
        Swal.fire("Error", "Debes completar ambos horarios.", "error");
        return;
    }

    horarios.push({ dia, horaInicio, horaFin });
    mostrarHorarios();
});

function mostrarHorarios() {
    listaHorarios.innerHTML = "";
    horarios.forEach((h, i) => {
        const li = document.createElement("li");
        li.className =
            "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            ${h.dia}: ${h.horaInicio} - ${h.horaFin}
            <button class="btn btn-sm btn-danger" onclick="eliminarHorario(${i})">
                <i class="bi bi-trash"></i>
            </button>`;
        listaHorarios.appendChild(li);
    });
}

function eliminarHorario(index) {
    horarios.splice(index, 1);
    mostrarHorarios();
}

// ==========================
// ACTUALIZAR TABLA
// ==========================
function actualizarTabla() {
    tablaBody.innerHTML = "";
    medicos.forEach((m, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${m.nombre}</td>
            <td>${m.especialidad}</td>
            <td>${m.matricula}</td>
            <td>${m.fechaAlta}</td>
            <td>${m.obrasSociales.join(", ")}</td>
            <td>${m.telefono}</td>
            <td>${m.email}</td>
            <td class="text-center">
                <div class="btn-group d-flex justify-content-center gap-1">
                    <button class="btn btn-info btn-sm" title="Ver" onclick="verMedico(${index})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm" title="Editar" onclick="editarMedico(${index})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" title="Eliminar" onclick="eliminarMedico(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tablaBody.appendChild(fila);
    });
}

actualizarTabla();

// ==========================
// VER MÉDICO
// ==========================
function verMedico(index) {
    const medico = medicos[index];

    const horariosTexto = medico.horarios
        .map((h) => {
            if (h.horas && h.horas.length > 0) {
                return `${h.dia}: ${h.horas[0]}`;
            } else if (h.horaInicio && h.horaFin) {
                return `${h.dia}: ${h.horaInicio} - ${h.horaFin}`;
            } else {
                return `${h.dia}: (sin horario definido)`;
            }
        })
        .join("<br>");

    Swal.fire({
        title: medico.nombre,
        html: `
            <p><strong>Especialidad:</strong> ${medico.especialidad}</p>
            <p><strong>Matrícula:</strong> ${medico.matricula}</p>
            <p><strong>Fecha de alta:</strong> ${medico.fechaAlta}</p>
            <p><strong>Obras Sociales:</strong> ${medico.obrasSociales.join(", ")}</p>
            <p><strong>Teléfono:</strong> ${medico.telefono}</p>
            <p><strong>Email:</strong> ${medico.email}</p>
            <p><strong>Descripción:</strong> ${medico.descripcion || "No especificada"}</p>
            <p><strong>Valor de consulta:</strong> $${medico.valorConsulta || "No informado"}</p>
            <p><strong>Horarios:</strong><br>${horariosTexto}</p>
        `,
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#0d6efd",
    });
}

// ==========================
// EDITAR MÉDICO
// ==========================
function editarMedico(index) {
    const medico = medicos[index];
    medicoEditandoIndex = index;
    editando = true;

    document.getElementById("nombre").value = medico.nombre;
    document.getElementById("especialidad").value = medico.especialidad;
    document.getElementById("matricula").value = medico.matricula;
    document.getElementById("fechaAlta").value = medico.fechaAlta;
    document.getElementById("telefono").value = medico.telefono;
    document.getElementById("email").value = medico.email;
    document.getElementById("descripcion").value = medico.descripcion || "";
    document.getElementById("valorConsulta").value = medico.valorConsulta || "";

    // Obras sociales
    const obraSocialSelect = document.getElementById("obraSocial");
    Array.from(obraSocialSelect.options).forEach(
        (opt) => (opt.selected = medico.obrasSociales.includes(opt.value))
    );

    // Cargar horarios (soporta formato anterior)
    horarios = medico.horarios.map((h) => {
        if (h.horas && h.horas.length > 0) {
            const [inicio, fin] = h.horas[0].split(" - ");
            return { dia: h.dia, horaInicio: inicio.trim(), horaFin: fin.trim() };
        } else {
            return h;
        }
    });
    mostrarHorarios();

    // Scroll al formulario
    form.scrollIntoView({ behavior: "smooth" });
}

// ==========================
// ELIMINAR MÉDICO
// ==========================
function eliminarMedico(index) {
    Swal.fire({
        title: "¿Eliminar médico?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            medicos.splice(index, 1);
            localStorage.setItem("medicos", JSON.stringify(medicos));
            actualizarTabla();
            Swal.fire(
                "Eliminado",
                "El médico fue eliminado correctamente.",
                "success"
            );
        }
    });
}

// ==========================
// GUARDAR / ACTUALIZAR MÉDICO
// ==========================
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const especialidad = document.getElementById("especialidad").value;
    const matricula = document.getElementById("matricula").value.trim();
    const fechaAlta = document.getElementById("fechaAlta").value;
    const telefono = document.getElementById("telefono").value.trim();
    const email = document.getElementById("email").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const valorConsulta = parseFloat(
        document.getElementById("valorConsulta").value
    );
    const obrasSociales = Array.from(
        document.getElementById("obraSocial").selectedOptions
    ).map((opt) => opt.value);

    if (
        !nombre ||
        !especialidad ||
        !matricula ||
        !fechaAlta ||
        obrasSociales.length === 0 ||
        horarios.length === 0
    ) {
        Swal.fire("Error", "Completá todos los campos requeridos.", "error");
        return;
    }

    const nuevoMedico = {
        nombre,
        especialidad,
        matricula,
        fechaAlta,
        obrasSociales,
        telefono,
        email,
        descripcion,
        valorConsulta,
        horarios,
    };

    if (editando) {
        medicos[medicoEditandoIndex] = nuevoMedico;
        editando = false;
        medicoEditandoIndex = -1;
        Swal.fire("Actualizado", "El médico fue actualizado correctamente.", "success");
    } else {
        medicos.push(nuevoMedico);
        Swal.fire("Alta exitosa", "El médico fue registrado correctamente.", "success");
    }

    localStorage.setItem("medicos", JSON.stringify(medicos));
    form.reset();
    horarios = [];
    mostrarHorarios();
    actualizarTabla();
});
