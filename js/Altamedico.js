const formAltaMedico = document.getElementById('altaMedicoForm');
const inputNombre = document.getElementById('nombreApellido');
const inputEspecialidad = document.getElementById('especialidad');
const inputMatricula = document.getElementById('matricula');
const inputObraS = document.getElementById('obraSocial');
const inputTelefono = document.getElementById('telefono');
const inputFechaAlta = document.getElementById('fechaAlta'); 
const myModalEl = document.getElementById('myModal');
const myInput = document.getElementById('myInput');
const modalBootstrap = new bootstrap.Modal(myModalEl);


const toastLiveExample = document.getElementById('liveToast');
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
const nombreDoctorToast = document.getElementById('nombreDoctorToast');


const fotosDoctores = {
   "Cardiología": "https://randomuser.me/api/portraits/men/32.jpg",
  "Pediatría"  : "https://randomuser.me/api/portraits/women/44.jpg" ,  
  "Dermatología":"https://randomuser.me/api/portraits/men/54.jpg" ,
  "Ginecología":"https://randomuser.me/api/portraits/women/55.jpg",

};

 

function altaMedicos(event) {
  event.preventDefault();

  const nombre = inputNombre.value.trim();
  const especialidad = inputEspecialidad.value.trim();
  const matricula = inputMatricula.value.trim();
  const obraSocial = inputObraS.value.trim();
  const telefono = inputTelefono.value.trim();
  const fechaAlta = inputFechaAlta.value.trim();


  if (!nombre || !especialidad || !matricula || !obraSocial || !telefono || !fechaAlta) {
    alert("Por favor completá todos los campos.");
    return;
  }

 
  const modalBody = myModalEl.querySelector('.modal-body p');
  modalBody.innerHTML = `
    <strong>Médico registrado correctamente:</strong><br>
    <b>Nombre:</b> ${nombre}<br>
    <b>Especialidad:</b> ${especialidad}<br>
    <b>Matrícula:</b> ${matricula}<br>
    <b>Obra Social:</b> ${obraSocial}<br>
    <b>Teléfono:</b> ${telefono}<br>
    <b>Fecha de alta:</b> ${fechaAlta}
  
    `;

  // Muestra el modal
  modalBootstrap.show();

  // Limpia el formulario
  formAltaMedico.reset();

  // Actualiza el toast
  const toastImg = toastLiveExample.querySelector('.toast-img');
  toastImg.src = fotosDoctores[especialidad] || "https://randomuser.me/api/portraits/men/99.jpg";
  nombreDoctorToast.textContent = nombre;
} 
 

document.getElementById('liveToastBtn').addEventListener('click', () => {
  toastBootstrap.show();
  modalBootstrap.hide();
});

-
formAltaMedico.addEventListener('submit', altaMedicos);



