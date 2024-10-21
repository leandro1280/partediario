// functions.js

// Función para mostrar el día de la semana basado en la fecha seleccionada
function mostrarDiaSemana() {
    const fechaInput = document.getElementById('fecha').value;
    if (fechaInput) {
        const fecha = new Date(fechaInput + 'T00:00:00'); // Agregar hora para evitar desfase de zona horaria
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const diaSemana = diasSemana[fecha.getDay()];
        document.getElementById('dia-semana').value = diaSemana;
    } else {
        document.getElementById('dia-semana').value = '';
    }
}

// Función para autocompletar el turno basado en el grado seleccionado
function actualizarTurno(selectElement) {
    const grado = selectElement.value.toLowerCase();
    let turno = '';
    if (["1ro 1ra", "2do 1ra", "3ro primera", "4to 1ra", "5to", "6to 2da"].includes(grado)) {
        turno = 'Mañana';
    } else if (["1ro 2da", "1ro 3ra", "2do 2da", "2do 3ra", "3ro 2da"].includes(grado)) {
        turno = 'Tarde';
    } else if (["4to 2da", "5to 1ra", "6to 1ra"].includes(grado)) {
        turno = 'Vespertino';
    }

    // Buscar el input de turno en la misma fila
    const row = selectElement.closest('.docente-row');
    const turnoInput = row.querySelector('input[name="turno"]');
    if (turnoInput) {
        turnoInput.value = turno;
    }
}

// Función para generar y descargar el PDF
function generarPDF() {
    // Verificar si la contraseña es correcta
    const password = document.getElementById('password').value;
    if (password !== '2024') {
        alert("Contraseña incorrecta. No se puede generar el PDF.");
        return;
    }
    // Verificar si la librería jsPDF está cargada
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
        // Manejo de errores para jsPDF no cargada
        alert("Error: La librería jsPDF no está cargada.");
        return;
    }
    // Crear un nuevo documento PDF
    const doc = new jsPDF();
    // Posiciones iniciales para el contenido del PDF
    let x = 20;
    let y = 30;
    // Título
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text("Parte Diario", x, y);
    y += 20;

    // Obtener los datos del formulario
    var fecha = document.getElementById('fecha').value;
    if (!fecha) {
        alert("Por favor, ingrese la fecha antes de generar el PDF.");
        return;
    }
    var diaSemana = document.getElementById('dia-semana').value;

    let establecimiento = document.getElementById('establecimiento').value;

    // Información del Establecimiento y Fecha
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Establecimiento: ${establecimiento}`, x, y);
    doc.text(`Fecha: ${fecha}`, x, y + 10);
    doc.text(`Día de la Semana: ${diaSemana}`, x, y + 20);
    y += 40;

    // Novedades del Personal - Docentes
    doc.setFont('helvetica', 'bold');
    doc.text("Novedades del Personal - Docentes", x, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    document.querySelectorAll('.docente-row').forEach((row) => {
        let docente = row.querySelector('input[name="docente"]').value;
        let materia = row.querySelector('input[name="materia"]').value;
        let grado = row.querySelector('select[name="grado"]').value;
        let turno = row.querySelector('input[name="turno"]').value;
        let modulos = row.querySelector('input[name="modulos"]').value;
        let motivo = row.querySelector('input[name="motivo-docente"]').value;

        let texto = `Docente: ${docente} | Materia: ${materia} | Grado: ${grado} | Turno: ${turno} | Módulos: ${modulos} | Motivo: ${motivo}`;
        doc.text(texto, x, y);
        y += 10;

        // Verificar si hay que agregar una nueva página
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });
    y += 10;

    // Personal de Cargo
    doc.setFont('helvetica', 'bold');
    doc.text("Personal de Cargo", x, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    document.querySelectorAll('.cargo-row').forEach((row) => {
        let nombre = row.querySelector('input[name="nombre-cargo"]').value;
        let apellido = row.querySelector('input[name="apellido-cargo"]').value;
        let funcion = row.querySelector('input[name="funcion-cargo"]').value;
        let turno = row.querySelector('input[name="turno-cargo"]').value;

        let texto = `Nombre: ${nombre} ${apellido} | Función: ${funcion} | Turno: ${turno}`;
        doc.text(texto, x, y);
        y += 10;

        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });
    y += 10;

    // Personal Auxiliar
    doc.setFont('helvetica', 'bold');
    doc.text("Personal Auxiliar", x, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    document.querySelectorAll('.auxiliar-row').forEach((row) => {
        let nombre = row.querySelector('input[name="nombre-auxiliar"]').value;
        let apellido = row.querySelector('input[name="apellido-auxiliar"]').value;
        let motivo = row.querySelector('input[name="motivo-auxiliar"]').value;
        let turno = row.querySelector('input[name="turno-auxiliar"]').value;

        let texto = `Nombre: ${nombre} ${apellido} | Motivo: ${motivo} | Turno: ${turno}`;
        doc.text(texto, x, y);
        y += 10;

        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });

    // Descargar el PDF con el nombre personalizado con la fecha
    doc.save(`parte-diario-${fecha}.pdf`);
}

// Función para actualizar la vista previa de los datos ingresados
function actualizarVistaPrevia() {
    const vistaPrevia = document.getElementById('vista-previa');
    let contenido = '';

    // Recorrer las filas de docentes y agregar sus datos
    document.querySelectorAll('.docente-row').forEach((row, index) => {
        const docente = row.querySelector('input[name="docente"]').value;
        const materia = row.querySelector('input[name="materia"]').value;
        const grado = row.querySelector('select[name="grado"]').value;
        const turno = row.querySelector('input[name="turno"]').value;
        const modulos = row.querySelector('input[name="modulos"]').value;
        const motivo = row.querySelector('input[name="motivo-docente"]').value;

        contenido += `<p><strong>Docente ${index + 1}:</strong> ${docente}, Materia: ${materia}, Grado: ${grado}, Turno: ${turno}, Módulos: ${modulos}, Motivo: ${motivo}</p>`;
    });

    // Personal de Cargo
    document.querySelectorAll('.cargo-row').forEach((row, index) => {
        const nombre = row.querySelector('input[name="nombre-cargo"]').value;
        const apellido = row.querySelector('input[name="apellido-cargo"]').value;
        const funcion = row.querySelector('input[name="funcion-cargo"]').value;
        const turno = row.querySelector('input[name="turno-cargo"]').value;

        contenido += `<p><strong>Personal de Cargo ${index + 1}:</strong> ${nombre} ${apellido}, Función: ${funcion}, Turno: ${turno}</p>`;
    });

    // Personal Auxiliar
    document.querySelectorAll('.auxiliar-row').forEach((row, index) => {
        const nombre = row.querySelector('input[name="nombre-auxiliar"]').value;
        const apellido = row.querySelector('input[name="apellido-auxiliar"]').value;
        const motivo = row.querySelector('input[name="motivo-auxiliar"]').value;
        const turno = row.querySelector('input[name="turno-auxiliar"]').value;

        contenido += `<p><strong>Personal Auxiliar ${index + 1}:</strong> ${nombre} ${apellido}, Motivo: ${motivo}, Turno: ${turno}</p>`;
    });

    vistaPrevia.innerHTML = contenido;
}

// Agregar eventos para actualizar la vista previa al cambiar cualquier input
document.addEventListener('input', actualizarVistaPrevia);

// Función para agregar nuevos campos de docentes, personal de cargo y personal auxiliar
document.addEventListener('DOMContentLoaded', function () {
    // Evento para agregar un nuevo docente
    document.getElementById('add-docente').addEventListener('click', function() {
        let container = document.getElementById('docente-container');

        // Crear una nueva fila de inputs
        let newDocenteRow = document.createElement('div');
        newDocenteRow.classList.add('row', 'mb-3', 'docente-row');

        newDocenteRow.innerHTML = `
            <div class="col-md-2">
                <input type="text" class="form-control" name="docente" placeholder="Apellido y Nombre">
            </div>
            <div class="col-md-2">
                <input type="text" class="form-control" name="materia" placeholder="Materia">
            </div>
            <div class="col-md-2">
                <select class="form-select" name="grado" onchange="actualizarTurno(this)">
                    <option value="" selected disabled>Seleccione el Grado</option>
                    <option value="1ro 1ra">1ro 1ra</option>
                    <!-- ... otras opciones ... -->
                </select>
            </div>
            <div class="col-md-2">
                <input type="text" class="form-control" name="turno" placeholder="Turno" readonly>
            </div>
            <div class="col-md-2">
                <input type="number" class="form-control" name="modulos" placeholder="Cantidad">
            </div>
            <div class="col-md-2">
                <input type="text" class="form-control" name="motivo-docente" placeholder="Motivo">
            </div>
        `;
        container.appendChild(newDocenteRow);
    });

    // Eventos similares para 'add-cargo' y 'add-auxiliar'
    // ...

    // Agregar eventos para los otros botones de agregar
    document.getElementById('add-cargo').addEventListener('click', function() {
        let container = document.getElementById('cargo-container');

        let newCargoRow = document.createElement('div');
        newCargoRow.classList.add('row', 'mb-3', 'cargo-row');

        newCargoRow.innerHTML = `
            <div class="col-md-3">
                <input type="text" class="form-control" name="nombre-cargo" placeholder="Nombre">
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control" name="apellido-cargo" placeholder="Apellido">
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control" name="funcion-cargo" placeholder="Función">
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control" name="turno-cargo" placeholder="Turno">
            </div>
        `;
        container.appendChild(newCargoRow);
    });

    document.getElementById('add-auxiliar').addEventListener('click', function() {
        let container = document.getElementById('auxiliar-container');

        let newAuxiliarRow = document.createElement('div');
        newAuxiliarRow.classList.add('row', 'mb-3', 'auxiliar-row');

        newAuxiliarRow.innerHTML = `
            <div class="col-md-3">
                <input type="text" class="form-control" name="nombre-auxiliar" placeholder="Nombre">
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control" name="apellido-auxiliar" placeholder="Apellido">
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control" name="motivo-auxiliar" placeholder="Motivo">
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control" name="turno-auxiliar" placeholder="Turno">
            </div>
        `;
        container.appendChild(newAuxiliarRow);
    });
});
