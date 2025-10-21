document.addEventListener('DOMContentLoaded', () => {
    const rol = sessionStorage.getItem('rolUsuario'); 

    if (rol !== 'admin') {
        const adminLinks = document.querySelectorAll('.admin-only');
        adminLinks.forEach(link => link.style.display = 'none');
    }
});