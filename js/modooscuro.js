document.addEventListener('DOMContentLoaded', () => {
  const boton = document.getElementById('modoOscuroBtn');
  const icono = document.getElementById('iconoModo');
  const texto = document.getElementById('textoModo');
  const navbar = document.getElementById('navbar');
  const formulario = document.querySelector('.formulario');
  const body = document.body;

  // 🔹 Recuperar el modo guardado en localStorage
  let modoOscuro = localStorage.getItem('modoOscuro') === 'true';

  // 🔹 Aplicar el modo al cargar la página
  if (modoOscuro) {
    activarModoOscuro();
  } else {
    activarModoClaro();
  }

  // 🔹 Escuchar el click del botón
  boton.addEventListener('click', () => {
    modoOscuro = !modoOscuro;
    if (modoOscuro) {
      activarModoOscuro();
    } else {
      activarModoClaro();
    }
    localStorage.setItem('modoOscuro', modoOscuro);
  });

  // 🔹 Funciones auxiliares
  function activarModoOscuro() {
    icono.classList.remove('bi-sun-fill');
    icono.classList.add('bi-moon-fill');
    if (texto) texto.textContent = 'Modo claro';

    body.classList.add('bg-dark', 'text-light');
    body.classList.remove('bg-light', 'text-dark');

    if (navbar) {
      navbar.classList.add('navbar-dark', 'bg-dark');
      navbar.classList.remove('navbar-dark', 'bg-primary');
    }

    if (formulario) {
      formulario.classList.remove('bg-light', 'text-dark');
      formulario.classList.add('bg-secondary', 'text-light');
    }
  }

  function activarModoClaro() {
    icono.classList.remove('bi-moon-fill');
    icono.classList.add('bi-sun-fill');
    if (texto) texto.textContent = 'Modo oscuro';

    body.classList.add('bg-light', 'text-dark');
    body.classList.remove('bg-dark', 'text-light');

    if (navbar) {
      navbar.classList.add('navbar-dark', 'bg-primary');
      navbar.classList.remove('navbar-dark', 'bg-dark');
    }

    if (formulario) {
      formulario.classList.remove('bg-secondary', 'text-light');
      formulario.classList.add('bg-light', 'text-dark');
    }
  }
});
