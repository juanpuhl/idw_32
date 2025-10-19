
const formAltaMedicos = document.getElementById('altaMedicoForm');
const inputNombre = document.getElementById('nombre');
const inputEspecialidad = document.getElementById('especialidad');
//nuevos campos agregads por joaquin
const inputMatricula    = document.getElementById('matricula');
const inputFechaAlta    = document.getElementById('fechaAlta');
//fin campos agregados por joaquin
const inputObraSocial = document.getElementById('obraSocial');
const inputEmail = document.getElementById('email');
const inputTelefono = document.getElementById('telefono');
//constantes de tabla
const tablaMedicosBody = document.querySelector('#tablaMedicos tbody');


//modal agregado por jaoquin
const modalEl = document.getElementById('altaMedicoModal');
const modal   = new bootstrap.Modal(modalEl);
const resumen = document.getElementById('resumenAlta');

//bandera para validacion
 let flagIndex = null;
 //funcion para actualizar tabla medicos
 function ActualizarTablaMedicos() {
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    tablaMedicosBody.innerHTML = ''; //limpiar tabla

    medicos.forEach((medico, index) => {
      let fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${medico.nombre}</td>
        <td>${medico.especialidad}</td>
        <td>${medico.matricula}</td>
        <td>${medico.fechaAlta}</td>
        <td>${medico.obrasSociales}</td>
        <td>${medico.telefono}</td>
        <td>${medico.email}</td>
        <td><button class="btn btn-sm btn-primary btn-editar" data-index="${index}">Editar</button>
            <button class="btn btn-sm btn-danger btn-eliminar" data-index="${index}">Eliminar</button>
        </td>
      `;
      tablaMedicosBody.appendChild(fila);
    });
  }

  tablaMedicosBody.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-editar')) {
      const index = Number (event.target.dataset.index);
      editarMedicos(index);
    }
    if (event.target.classList.contains('btn-eliminar')) {
      const index = Number (event.target.dataset.index);
      eliminarMedicos(index);
    }
  });

  //funcion editar medicos
  function editarMedicos(index) {
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    const medico = medicos[index];
    inputNombre.value = medico.nombre;
    inputEspecialidad.value = medico.especialidad;
    inputMatricula.value = medico.matricula;
    inputFechaAlta.value = medico.fechaAlta;
    inputObraSocial.value = medico.obrasSociales;
    inputEmail.value = medico.email;
    inputTelefono.value = medico.telefono;
    flagIndex = index; //guardamos el indice para saber que estamos editando
  }

  //funcion eliminar medicos
  async function eliminarMedicos(index) {
  let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
  const nombre = medicos[index]?.nombre || 'este médico';

  const { isConfirmed } = await Swal.fire({
    title: '¿Eliminar médico?',
    html: `Vas a eliminar a <b>${nombre}</b>. Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    focusCancel: true
  });

  if (!isConfirmed) return;

  medicos.splice(index, 1);
  localStorage.setItem('medicos', JSON.stringify(medicos));
  ActualizarTablaMedicos();   
  flagIndex = null;

  await Swal.fire({
    icon: 'success',
    title: 'Eliminado',
    text: 'El médico fue eliminado correctamente.',
    timer: 1500,
    showConfirmButton: false
  });
  }


  //funcion alta medicos
  function altaMedicos(event) {
    event.preventDefault();

    let nombre = inputNombre.value.trim();
    let especialidad = inputEspecialidad.value.trim();
    let matricula = inputMatricula.value.trim();
    let fechaAlta = inputFechaAlta.value;
    //let obrasSociales = inputObraSocial.value.trim();
    let obrasSociales = Array.from(inputObraSocial.selectedOptions).map(o => o.value).join(', '); //para la seleccion multiple
    let email = inputEmail.value.trim();
    let telefono = inputTelefono.value.trim();
    
 
// validacion con SweetAlert2
  const faltantes = [];
  if (!nombre)        faltantes.push('Nombre');
  if (!especialidad)  faltantes.push('Especialidad');
  if (!obrasSociales) faltantes.push('Obras Sociales');
  if (!email)         faltantes.push('Email');
  if (!telefono)      faltantes.push('Teléfono');
  if (!matricula)     faltantes.push('Matrícula');
  if (!fechaAlta)     faltantes.push('Fecha de alta');

  if (faltantes.length) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      html: `
        <p class="mb-2">Por favor, completá los siguientes campos:</p>
        <ul class="text-start mb-0">
          ${faltantes.map(f => `<li>${f}</li>`).join('')}
        </ul>
      `,
      confirmButtonText: 'Entendido'
    });
    return;
  }

  let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
  const medico = {
    nombre,
    especialidad,
    obrasSociales,
    email,
    telefono,
    matricula,
    fechaAlta 
  }
  if(flagIndex !== null) {
    //editar
    medicos[flagIndex] = medico;
    flagIndex = null; //reseteamos la bandera
  } else {
    //nuevo alta
    medicos.push(medico);
  }
  localStorage.setItem('medicos', JSON.stringify(medicos));
  ActualizarTablaMedicos();

  //RESUMEN en el modal Bootstrap (si todo ok)
  resumen.innerHTML = `
    <strong>Médico registrado:</strong><br>
    <b>Nombre:</b> ${nombre}<br>
    <b>Especialidad:</b> ${especialidad}<br>
    <b>Obras Sociales:</b> ${obrasSociales}<br>
    <b>Email:</b> ${email}<br>
    <b>Teléfono:</b> ${telefono}<br>
    <b>Matrícula:</b> ${matricula}<br>
    <b>Fecha de alta:</b> ${fechaAlta}
  `;
  //mostra el modal
  modal.show();
  

  //resetea el formulario
  formAltaMedicos.reset();


}

ActualizarTablaMedicos();
formAltaMedicos.addEventListener('submit', altaMedicos)
