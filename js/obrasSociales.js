// ============================
// LISTADO DE OBRAS SOCIALES - SEMILLA PROTEGIDA
// ============================

function inicializarObrasSociales() {
  const SEED = [
    {
      id: 1,
      nombre: "Sempre",
      descripcion: "Obra Social de la Provincia de La Pampa.",
      logo: "img/obras/sempre.png",
      activa: true
    },
    {
      id: 2,
      nombre: "Jerárquicos Salud",
      descripcion: "Obra social de Empleados Jerárquicos del Banco Nación.",
      logo: "img/obras/jerarquicos.png",
      activa: true
    },
    {
      id: 3,
      nombre: "Swiss Medical",
      descripcion: "Medicina prepaga, seguros y ART.",
      logo: "img/obras/swiss.png",
      activa: true
    }
  ];

  let actuales = JSON.parse(localStorage.getItem("obrasSociales")) || [];

  // Si está vacío o no hay seed, restaurar base
  if (!Array.isArray(actuales) || actuales.length === 0) {
    localStorage.setItem("obrasSociales", JSON.stringify(SEED));
    return;
  }

  // Agregar faltantes (no sobrescribe los editados)
  SEED.forEach(base => {
    const existe = actuales.some(o => o.nombre.toLowerCase() === base.nombre.toLowerCase());
    if (!existe) {
      actuales.push(base);
    }
  });

  localStorage.setItem("obrasSociales", JSON.stringify(actuales));
}

// Ejecutar semilla al cargar el archivo
inicializarObrasSociales();

// ============================
// FUNCIONES DE ACCESO
// ============================

function getObrasSociales() {
  return JSON.parse(localStorage.getItem("obrasSociales")) || [];
}

function renderObrasSocialesSelect(selectElementId) {
  const obras = getObrasSociales().filter(o => o.activa);
  const select = document.getElementById(selectElementId);
  if (!select) return;
  select.innerHTML = "";
  obras.forEach(o => {
    const opt = document.createElement("option");
    opt.value = o.nombre;
    opt.textContent = o.nombre;
    select.appendChild(opt);
  });
}
