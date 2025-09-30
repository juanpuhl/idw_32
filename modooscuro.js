document.addEventListener('DOMContentLoaded', () => {
const boton = document.getElementById('modoOscuroBtn');
const icono = document.getElementById('iconoModo');
const navbar = document.getElementById('navbar');
const formulario = document.querySelector('.formulario');
const itemsvalores = document.querySelector('.list-group');
const body = document.body;
let modoOscuro = false;

boton.addEventListener('click', () => {
    modoOscuro = !modoOscuro;
        if (modoOscuro) {
            // mostrar luna
            icono.classList.remove('bi-sun-fill');
            icono.classList.add('bi-moon-fill');
            // cambiar los colorres
            body.classList.add('bg-dark', 'text-light');
            body.classList.remove('bg-light', 'text-dark');
            navbar.classList.add('navbar-dark', 'bg-dark');
            navbar.classList.remove('navbar-dark', 'bg-primary');
            formulario.classList.remove('bg-light', 'text-dark');
            formulario.classList.add('bg-secondary', 'text-light');
            itemsvalores.forEach(item => {
                item.classList.remove('bg-light', 'text-dark');
                item.classList.add('bg-dark', 'text-light');
            });
        } else {
            // mostrar sol
            icono.classList.remove('bi-moon-fill');
            icono.classList.add('bi-sun-fill');
            // Cambiar los colores
            body.classList.add('bg-light', 'text-dark');
            body.classList.remove('bg-dark', 'text-light');
            navbar.classList.add('navbar-dark', 'bg-primary');
            navbar.classList.remove('navbar-dark', 'bg-dark');
            formulario.classList.remove('bg-secondary', 'text-light');
            formulario.classList.add('bg-light', 'text-dark');
            itemsvalores.forEach(item => {
                item.classList.remove('bg-dark', 'text-light');
                item.classList.add('bg-light', 'text-dark');
            });
                
        }
    });
});

