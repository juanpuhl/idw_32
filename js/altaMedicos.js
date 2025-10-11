const formAltaMedicos = document.getElementById('altaMedicoForm');
const inputNombre = document.getElementById('nombre');
const inputEspecialidad = document.getElementById('especialidad');
const inputObraSocial = document.getElementById('obraSocial');
const inputEmail = document.getElementById('email');
const inputTelefono = document.getElementById('telefono');


function altaMedicos(event) {
    event.preventDefault();

    let nombre = inputNombre.value.trim();
    let especialidad = inputEspecialidad.value.trim();
    let obrasSociales = inputObraSocial.value.trim();
    let email = inputEmail.value.trim();
    let telefono = inputTelefono.value.trim();

    if(!nombre || !especialidad || !obrasSociales || !email || !telefono) {
        alert('Por favor, complete todos los campos.');
        return;
    }
    alert(
    `Médico registrado:\n\n` +
    `Nombre: ${nombre}\n` +
    `Especialidad: ${especialidad}\n` +
    `Obras Sociales: ${obrasSociales}\n` +
    `Email: ${email}\n` +
    `Teléfono: ${telefono}\n\n` +
    `Dado de alta con éxito.`
  );
    formAltaMedicos.reset();

}
formAltaMedicos.addEventListener('submit', altaMedicos)
