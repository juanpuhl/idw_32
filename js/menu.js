document.addEventListener('DOMContentLoaded', () => {
    const rol = sessionStorage.getItem('rolUsuario');
    const adminLinks = document.querySelectorAll('.admin-only');

    // Si no hay rol o no es admin, ocultar los enlaces de admin
    if (!rol || rol !== 'admin') {
        adminLinks.forEach(link => link.style.display = 'none');
    } else {
        adminLinks.forEach(link => link.style.display = 'block');
    }
});
