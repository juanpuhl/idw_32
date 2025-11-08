 // formulario del turno 
const formTurno = document.getElementById("formTurno");
const listaTurnos = document.getElementById("listaTurnos");
//  para no poner fechas anteriores 
document.getElementById("fechaTurno").min = new Date().toISOString().split("T")[0];

formTurno.addEventListener("submit", function (e) {
  e.preventDefault();


 const nombre = document.getElementById("nombreApellido").value.trim();
  const especialidad = document.getElementById("especialidad").value.trim();
  const dni = document.getElementById("DNI").value.trim();
  const horario = document.getElementById("horarioTurno").value.trim();
  const fecha = document.getElementById("fechaTurno").value.trim();
  const obraSocial = Array.from(document.getElementById("obraSocial").selectedOptions).map(opt => opt.value);
  const email = document.getElementById("email").value.trim();
  const telefono = document.getElementById("telefono").value.trim();

  if (!nombre || !especialidad || !dni || !horario || !fecha || obraSocial.length === 0 || !telefono || !email) {
    Swal.fire({
      icon: "error",
      title: "Faltan datos",
      text: "Por favor, completá todos los campos.",
    });
    return;
  }


// seccion de turnos ocupados
 const turnosOcupados = [
    { fecha: '2025-11-14', hora: '15:45'},
    { fecha: '2025-11-25', hora: '19:30' },
    { fecha: '2025-12-28', hora: '11:11' ,},
    { fecha: '2025-12-30', hora: '20:00' ,},
    { fecha: '2026-01-16', hora: '09:00', },
  ];

 const ocupado = turnosOcupados.some(t => t.fecha === fecha && t.hora === horario );
//  alerta de turnos  ocupados con el fecha del turno + la hora 
 
if (ocupado) {
    Swal.fire({
      icon: "error",
      title: "Turno ocupado",
      text: `El turno del ${fecha} a las ${horario}  ya está ocupado. Elige otro día o el horario, por favor gracias .`,
    });
    return;
  }

//  mensaje de exito 
  Swal.fire({
    icon: "success",
    title: "Turno solicitado correctamente",
    html: `
      <b>Nombre:</b> ${nombre}<br>
      <b>Especialidad:</b> ${especialidad}<br>
      <b>DNI:</b> ${dni}<br>
      <b>Fecha:</b> ${fecha}<br>
      <b>Hora:</b> ${horario}<br>
      <b>Teléfono:</b> ${telefono}<br>
      <b>Obra Social:</b> ${obraSocial.join(", ")}<br>
      <b>Email:</b> ${email}<br>
      
    `,
    confirmButtonText: "Aceptar",
  });
//  campos de filas de los turnos 
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${nombre}</td>
    <td>${especialidad}</td>
    <td>${dni}</td>
    <td>${horario}</td>
    <td>${fecha}</td>
    <td>${obraSocial.join(", ")}</td>
    <td>${email}</td>
    <td>${telefono}</td>
  `;

  listaTurnos.appendChild(fila);
  formTurno.reset(); 
});
