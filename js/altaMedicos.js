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


//modal agregado por jaoquin
const modalEl = document.getElementById('altaMedicoModal');
const modal   = new bootstrap.Modal(modalEl);
const resumen = document.getElementById('resumenAlta');


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
formAltaMedicos.addEventListener('submit', altaMedicos)
