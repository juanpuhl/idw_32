const formLogin = document.getElementById('formLogin');
const usuario = document.getElementById('usuario');
const clave = document.getElementById('clave');
const mensaje = document.getElementById('mensaje');

function mostrarMensaje(texto, tipo = "danger") {
    mensaje.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${texto}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;

    // Desaparece automáticamente después de 3 segundos
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) {
            const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
            bsAlert.close();
        }
    }, 3000);
}

formLogin.addEventListener('submit', function (event) {
    event.preventDefault();

    const usuarioInput = usuario.value.trim();
    const claveInput = clave.value.trim();

    const isUsuario = (Array.isArray(usuarios)) ?
        usuarios.find(u => u.usuario === usuarioInput && u.clave === claveInput)
        : null;

    if (isUsuario) {

        //guardo el rol del usuario para saber que mostrar
        sessionStorage.setItem("rolUsuario", isUsuario.rol);

        sessionStorage.setItem("usuarioLogueado", usuarioInput);
        mostrarMensaje(`Bienvenido, ${usuarioInput}`, "success");

        // Redirige según rol después de 2 segundos
        setTimeout(() => {
            mensaje.innerHTML = ""; 
            if (isUsuario.rol === "admin") {
                window.location.href = "panelControl.html"; 
            } else {
                window.location.href = "index.html"; 
            }
        }, 2000);
    } else {
        mostrarMensaje('Error en las credenciales, intenta nuevamente.', "danger");
    }
});
