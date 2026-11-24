// Expresiones regulares para la validacion de cada campo
const expresiones = {
    cedula: /^\d{10}$/,
    apellidos: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
    nombres: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
    direccion: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ#\.,\-\s]{5,100}$/,
    telefono: /^09\d{8}$/,
    correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    facultad: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,60}$/,
    nivel: /^([1-9]|10)$/,
    paralelo: /^[a-zA-Z]$/
};

// Mensajes de error correspondientes a cada campo
const mensajesError = {
    cedula: 'La cedula debe contener exactamente 10 digitos numericos.',
    apellidos: 'Los apellidos solo deben contener letras (minimo 2 caracteres).',
    nombres: 'Los nombres solo deben contener letras (minimo 2 caracteres).',
    direccion: 'La direccion debe contener al menos 5 caracteres validos.',
    telefono: 'El telefono celular debe tener 10 digitos e iniciar con 09 (ej. 0987654321).',
    correo: 'Ingrese un correo electronico valido (ej. usuario@correo.com).',
    facultad: 'La facultad debe contener solo letras (minimo 3 caracteres).',
    nivel: 'El nivel debe ser un numero entre 1 y 10.',
    paralelo: 'El paralelo debe ser una sola letra (ej. A, B o C).'
};

// Referencias a los elementos del formulario
const formulario = document.getElementById('formularioEstudiante');
const btnLimpiar = document.getElementById('btnLimpiar');
const cuerpoTabla = document.getElementById('cuerpoTablaEstudiantes');
const contadorEstudiantes = document.getElementById('contadorEstudiantes');
const alertaGlobal = document.getElementById('alertaGlobal');

// Lista de campos que se validaran
const campos = [
    'cedula',
    'telefono',
    'apellidos',
    'nombres',
    'direccion',
    'correo',
    'facultad',
    'nivel',
    'paralelo'
];

// Obtener la lista de estudiantes almacenada en LocalStorage
function obtenerEstudiantes() {
    const datos = localStorage.getItem('estudiantes');
    return datos ? JSON.parse(datos) : [];
}

// Guardar la lista de estudiantes en LocalStorage
function guardarEstudiantesEnStorage(lista) {
    localStorage.setItem('estudiantes', JSON.stringify(lista));
}

// Mostrar una notificacion en pantalla
function mostrarAlerta(mensaje, tipo) {
    alertaGlobal.textContent = mensaje;
    alertaGlobal.className = `alerta alerta-${tipo}`;
    alertaGlobal.style.display = 'block';

    setTimeout(() => {
        alertaGlobal.style.display = 'none';
    }, 3500);
}

// Validar un campo individual usando su expresion regular
function validarCampo(nombreCampo) {
    const input = document.getElementById(nombreCampo);
    const spanError = document.getElementById(`error${nombreCampo.charAt(0).toUpperCase() + nombreCampo.slice(1)}`);
    const valor = input.value.trim();
    const regex = expresiones[nombreCampo];

    if (!regex.test(valor)) {
        spanError.textContent = mensajesError[nombreCampo];
        input.classList.add('campo-invalido');
        input.classList.remove('campo-valido');
        return false;
    }

    spanError.textContent = '';
    input.classList.remove('campo-invalido');
    input.classList.add('campo-valido');
    return true;
}

// Limpiar los mensajes y estados de validacion
function limpiarValidaciones() {
    campos.forEach(nombreCampo => {
        const input = document.getElementById(nombreCampo);
        const spanError = document.getElementById(`error${nombreCampo.charAt(0).toUpperCase() + nombreCampo.slice(1)}`);
        if (input) {
            input.classList.remove('campo-invalido', 'campo-valido');
        }
        if (spanError) {
            spanError.textContent = '';
        }
    });
}

// Renderizar la lista de estudiantes en la tabla HTML
function renderizarTabla() {
    const estudiantes = obtenerEstudiantes();
    cuerpoTabla.innerHTML = '';

    contadorEstudiantes.textContent = `Total registrados: ${estudiantes.length}`;

    if (estudiantes.length === 0) {
        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="10" class="fila-vacia">No hay estudiantes registrados.</td>
            </tr>
        `;
        return;
    }

    estudiantes.forEach((estudiante, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${estudiante.cedula}</td>
            <td>${estudiante.apellidos}</td>
            <td>${estudiante.nombres}</td>
            <td>${estudiante.direccion}</td>
            <td>${estudiante.telefono}</td>
            <td>${estudiante.correo}</td>
            <td>${estudiante.facultad}</td>
            <td>${estudiante.nivel}</td>
            <td>${estudiante.paralelo}</td>
            <td>
                <button type="button" class="btn btn-peligro" onclick="eliminarEstudiante(${index})">Eliminar</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}

// Eliminar un estudiante de la lista y actualizar LocalStorage
window.eliminarEstudiante = function(indice) {
    const estudiantes = obtenerEstudiantes();
    const estudiante = estudiantes[indice];

    if (confirm(`¿Desea eliminar al estudiante con cedula ${estudiante.cedula}?`)) {
        estudiantes.splice(indice, 1);
        guardarEstudiantesEnStorage(estudiantes);
        renderizarTabla();
        mostrarAlerta('Estudiante eliminado correctamente.', 'exito');
    }
};

// Escuchar el evento submit para validar y guardar los datos
formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    let formularioValido = true;

    // Validar cada uno de los campos con sus expresiones regulares
    campos.forEach(campo => {
        const esValido = validarCampo(campo);
        if (!esValido) {
            formularioValido = false;
        }
    });

    if (!formularioValido) {
        mostrarAlerta('Por favor revise los campos con errores.', 'error');
        return;
    }

    const cedulaValor = document.getElementById('cedula').value.trim();
    const estudiantesExistentes = obtenerEstudiantes();

    // Validar que la cedula no este registrada previamente
    const yaExiste = estudiantesExistentes.some(est => est.cedula === cedulaValor);
    if (yaExiste) {
        const spanErrorCedula = document.getElementById('errorCedula');
        spanErrorCedula.textContent = 'Ya existe un estudiante registrado con esta cedula.';
        document.getElementById('cedula').classList.add('campo-invalido');
        mostrarAlerta('La cedula ingresada ya se encuentra registrada.', 'error');
        return;
    }

    // Crear el objeto del nuevo estudiante
    const nuevoEstudiante = {
        cedula: cedulaValor,
        apellidos: document.getElementById('apellidos').value.trim(),
        nombres: document.getElementById('nombres').value.trim(),
        direccion: document.getElementById('direccion').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        facultad: document.getElementById('facultad').value.trim(),
        nivel: document.getElementById('nivel').value.trim(),
        paralelo: document.getElementById('paralelo').value.trim().toUpperCase()
    };

    // Guardar en el arreglo y persistir en LocalStorage
    estudiantesExistentes.push(nuevoEstudiante);
    guardarEstudiantesEnStorage(estudiantesExistentes);

    // Actualizar vista y limpiar formulario
    formulario.reset();
    limpiarValidaciones();
    renderizarTabla();
    mostrarAlerta('Estudiante registrado con exito.', 'exito');
});

// Validar en tiempo real cuando el usuario escribe o sale de un campo
campos.forEach(campo => {
    const input = document.getElementById(campo);
    if (input) {
        input.addEventListener('input', () => {
            if (input.classList.contains('campo-invalido')) {
                validarCampo(campo);
            }
        });
        input.addEventListener('blur', () => {
            if (input.value.trim() !== '') {
                validarCampo(campo);
            }
        });
    }
});

// Evento para limpiar el formulario y resetear estados
btnLimpiar.addEventListener('click', function () {
    formulario.reset();
    limpiarValidaciones();
});

// Cargar los datos almacenados al abrir la pagina
document.addEventListener('DOMContentLoaded', function () {
    renderizarTabla();
});
