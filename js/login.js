// ============================
// LOGIN DE USUARIO
// ============================
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
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) {
            const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
            bsAlert.close();
        }
    }, 3000);
}

formLogin.addEventListener('submit', async function(event) {
    event.preventDefault();

    const usuarioInput = usuario.value.trim();
    const claveInput = clave.value.trim();

    // ============================
    // VERIFICAR USUARIO LOCAL
    // ============================
    const usuariosLocales = JSON.parse(localStorage.getItem("users")) || [];
    const usuarioLocal = usuariosLocales.find(
        u => u.username === usuarioInput && u.password === claveInput
    );

    if (usuarioLocal) {
        sessionStorage.setItem("usuario", JSON.stringify(usuarioLocal));
        sessionStorage.setItem("usuarioLogueado", usuarioLocal.username);
        sessionStorage.setItem("rolUsuario", "usuario");
        localStorage.setItem("usuario", JSON.stringify(usuarioLocal));
        localStorage.setItem("usuarioLogueado", usuarioLocal.username);
        localStorage.setItem("rolUsuario", "usuario");

        mostrarMensaje(`Bienvenido, ${usuarioLocal.firstName} ${usuarioLocal.lastName}`, "success");

        setTimeout(() => {
            mensaje.innerHTML = "";
            window.location.href = 'index.html';
        }, 1200);
        return;
    }

    // ============================
    // LOGIN CON API (DUMMYJSON)
    // ============================
    try {
        const res = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usuarioInput, password: claveInput })
        });

        if (!res.ok) throw new Error('Usuario o contraseña incorrectos');
        const data = await res.json();

        sessionStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("usuarioLogueado", data.username);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("usuarioLogueado", data.username);

        const userRes = await fetch(`https://dummyjson.com/users/${data.id}`);
        const userData = await userRes.json();

        sessionStorage.setItem("usuario", JSON.stringify(userData));
        localStorage.setItem("usuario", JSON.stringify(userData));

        const rol = userData.role || 'visita';
        sessionStorage.setItem("rolUsuario", rol);
        localStorage.setItem("rolUsuario", rol);

        mostrarMensaje(`Bienvenido, ${userData.firstName} ${userData.lastName}`, "success");

        setTimeout(() => {
            mensaje.innerHTML = "";
            if (rol === 'admin') window.location.href = 'panelControl.html';
            else window.location.href = 'index.html';
        }, 1200);

    } catch (error) {
        console.error("Error en login:", error);
        mostrarMensaje(error.message, "danger");
    }
});
