
// LISTADO DE ESPECIALIDADES - BASE Y ACCESO GLOBAL


(function seedEspecialidades() {
  const SEED = [
    { id: 1, nombre: "Clínica Médica", descripcion: "Atención general y seguimiento integral del paciente.", activa: true },
    { id: 2, nombre: "Pediatría", descripcion: "Atención médica de niños y adolescentes.", activa: true },
    { id: 3, nombre: "Cardiología", descripcion: "Especialidad enfocada en el diagnóstico y tratamiento de enfermedades del corazón.", activa: true },
    { id: 4, nombre: "Ginecología", descripcion: "Salud integral de la mujer.", activa: true },
    { id: 5, nombre: "Dermatología", descripcion: "Tratamiento de enfermedades de la piel.", activa: true },
    { id: 6, nombre: "Traumatología", descripcion: "Lesiones y trastornos del sistema musculoesquelético.", activa: true },
    { id: 7, nombre: "Otorrinolaringología", descripcion: "Oídos, nariz, garganta y estructuras relacionadas.", activa: true },
    { id: 8, nombre: "Neurología", descripcion: "Sistema nervioso central y periférico.", activa: true },
    { id: 9, nombre: "Oftalmología", descripcion: "Diagnóstico y tratamiento de enfermedades oculares.", activa: true }
  ];

  let actuales = JSON.parse(localStorage.getItem("especialidades")) || [];

  // Si está vacío, se cargan las básicas
  if (!Array.isArray(actuales) || actuales.length === 0) {
    localStorage.setItem("especialidades", JSON.stringify(SEED));
    return;
  }

  // Agregar las que falten
  SEED.forEach(base => {
    const existe = actuales.some(e => e.nombre.toLowerCase() === base.nombre.toLowerCase());
    if (!existe) actuales.push(base);
  });

  localStorage.setItem("especialidades", JSON.stringify(actuales));
})();

// ============================
// FUNCIONES DE USO GLOBAL
// ============================

function getEspecialidades() {
  return JSON.parse(localStorage.getItem("especialidades")) || [];
}

function renderEspecialidadesSelect(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  const especialidades = getEspecialidades().filter(e => e.activa);
  select.innerHTML = "";

  especialidades.forEach(e => {
    const opt = document.createElement("option");
    opt.value = e.nombre;
    opt.textContent = e.nombre;
    select.appendChild(opt);
  });
}
