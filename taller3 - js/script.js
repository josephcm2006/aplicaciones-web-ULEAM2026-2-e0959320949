const cedula = document.getElementById('cedula');
const nombre = document.getElementById('nombre');
const direccion = document.getElementById('direccion');
const telefono = document.getElementById('telefono');
const correo = document.getElementById('correo');

const errorCedula = document.getElementById('error-cedula');
const errorNombre = document.getElementById('error-nombre');
const errorDireccion = document.getElementById('error-direccion');
const errorTelefono = document.getElementById('error-telefono');
const errorCorreo = document.getElementById('error-correo');

const alertaVerde = document.getElementById('alerta-verde');
const btnGuardar = document.getElementById('btn-guardar');
const btnLimpiar = document.getElementById('btn-limpiar');

btnGuardar.addEventListener('click', function () {
    let todoValido = true;
    alertaVerde.style.display = 'none';

    if (cedula.value.trim() !== '' && cedula.value.length === 10 && !isNaN(cedula.value)) {
        cedula.classList.remove('input-error');
        errorCedula.textContent = '';
    } else {
        cedula.classList.add('input-error');
        errorCedula.textContent = '10 dígitos numéricos';
        todoValido = false;
    }

    if (nombre.value.trim() !== '' && nombre.value.length <= 30) {
        nombre.classList.remove('input-error');
        errorNombre.textContent = '';
    } else {
        nombre.classList.add('input-error');
        errorNombre.textContent = 'Obligatorio. Máximo 30 carácteres';
        todoValido = false;
    }

    if (direccion.value.trim() !== '' && direccion.value.length <= 50) {
        direccion.classList.remove('input-error');
        errorDireccion.textContent = '';
    } else {
        direccion.classList.add('input-error');
        errorDireccion.textContent = 'Obligatorio. Máximo 50 carácteres';
        todoValido = false;
    }

    if (telefono.value.trim() !== '' && telefono.value.length === 10 && !isNaN(telefono.value)) {
        telefono.classList.remove('input-error');
        errorTelefono.textContent = '';
    } else {
        telefono.classList.add('input-error');
        errorTelefono.textContent = '10 dígitos numéricos';
        todoValido = false;
    }

    if (correo.value.includes('@') && correo.value.includes('.')) {
        correo.classList.remove('input-error');
        errorCorreo.textContent = '';
    } else {
        correo.classList.add('input-error');
        errorCorreo.textContent = 'Debe incluir @ y dominio';
        todoValido = false;
    }

    if (todoValido) {
        alertaVerde.style.display = 'block';
    }
});

btnLimpiar.addEventListener('click', function () {
    cedula.value = '';
    nombre.value = '';
    direccion.value = '';
    telefono.value = '';
    correo.value = '';

    cedula.classList.remove('input-error');
    nombre.classList.remove('input-error');
    direccion.classList.remove('input-error');
    telefono.classList.remove('input-error');
    correo.classList.remove('input-error');

    errorCedula.textContent = '';
    errorNombre.textContent = '';
    errorDireccion.textContent = '';
    errorTelefono.textContent = '';
    errorCorreo.textContent = '';

    alertaVerde.style.display = 'none';
});