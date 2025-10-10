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
    if (["1ro 1ra", "2do 1ra", "3ro primera", "4to 1ra", "5to 2da", "6to 2da"].includes(grado)) {
        turno = 'Mañana';
    } else if (["1ro 2da", "1ro 3ra", "2do 2da", "2do 3ra", "3ro 2da","3ro 3ra"].includes(grado)) {
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
    const fecha = document.getElementById('fecha').value;
    if (!fecha) {
        alert("Por favor, ingrese la fecha antes de generar el PDF.");
        return;
    }
    const diaSemana = document.getElementById('dia-semana').value;
    const establecimiento = document.getElementById('establecimiento').value;

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

    // Verificar si hay datos de docentes
    const docentes = document.querySelectorAll('.docente-row');
    if (docentes.length === 0) {
        doc.setFont('helvetica', 'normal');
        doc.text("No hay datos de docentes.", x, y);
        y += 10;
    } else {
        // Títulos de las columnas
        doc.setFont('helvetica', 'bold');
        doc.text("Docente", x, y);
        doc.text("Materia", x + 40, y);
        doc.text("Grado", x + 80, y);
        doc.text("Turno", x + 120, y);
        doc.text("Módulos", x + 160, y);
        doc.text("Motivo", x + 200, y);
        y += 10;

        // Datos de los docentes
        doc.setFont('helvetica', 'normal');
        docentes.forEach((row) => {
            const docente = row.querySelector('input[name="docente"]').value || '';
            const materia = row.querySelector('input[name="materia"]').value || '';
            const grado = row.querySelector('select[name="grado"]').value || '';
            const turno = row.querySelector('input[name="turno"]').value || '';
            const modulos = row.querySelector('input[name="modulos"]').value || '';
            const motivo = row.querySelector('input[name="motivo-docente"]').value || '';

            doc.text(docente, x, y);
            doc.text(materia, x + 40, y);
            doc.text(grado, x + 80, y);
            doc.text(turno, x + 120, y);
            doc.text(modulos, x + 160, y);
            doc.text(motivo, x + 200, y);
            y += 10;

            // Verificar si hay que agregar una nueva página
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });
    }

    y += 20;

    // Personal de Cargo
    doc.setFont('helvetica', 'bold');
    doc.text("Personal de Cargo", x, y);
    y += 10;

    const cargos = document.querySelectorAll('.cargo-row');
    if (cargos.length === 0) {
        doc.setFont('helvetica', 'normal');
        doc.text("No hay datos de personal de cargo.", x, y);
        y += 10;
    } else {
        // Títulos de las columnas
        doc.setFont('helvetica', 'bold');
        doc.text("Nombre", x, y);
        doc.text("Apellido", x + 40, y);
        doc.text("Función", x + 80, y);
        doc.text("Motivo", x + 120, y);
        y += 10;

        // Datos del personal de cargo
        doc.setFont('helvetica', 'normal');
        cargos.forEach((row) => {
            const nombre = row.querySelector('input[name="nombre-cargo"]').value || '';
            const apellido = row.querySelector('input[name="apellido-cargo"]').value || '';
            const funcion = row.querySelector('input[name="funcion-cargo"]').value || '';
            const turno = row.querySelector('input[name="Motivo-cargo"]').value || '';

            doc.text(nombre, x, y);
            doc.text(apellido, x + 40, y);
            doc.text(funcion, x + 80, y);
            doc.text(turno, x + 120, y);
            y += 10;

            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });
    }

    y += 20;

    // Personal Auxiliar
    doc.setFont('helvetica', 'bold');
    doc.text("Personal Auxiliar", x, y);
    y += 10;

    const auxiliares = document.querySelectorAll('.auxiliar-row');
    if (auxiliares.length === 0) {
        doc.setFont('helvetica', 'normal');
        doc.text("No hay datos de personal auxiliar.", x, y);
        y += 10;
    } else {
        // Títulos de las columnas
        doc.setFont('helvetica', 'bold');
        doc.text("Nombre", x, y);
        doc.text("Apellido", x + 40, y);
        doc.text("Motivo", x + 80, y);
        doc.text("Turno", x + 120, y);
        y += 10;

        // Datos del personal auxiliar
        doc.setFont('helvetica', 'normal');
        auxiliares.forEach((row) => {
            const nombre = row.querySelector('input[name="nombre-auxiliar"]').value || '';
            const apellido = row.querySelector('input[name="apellido-auxiliar"]').value || '';
            const motivo = row.querySelector('input[name="motivo-auxiliar"]').value || '';
            const turno = row.querySelector('input[name="turno-auxiliar"]').value || '';

            doc.text(nombre, x, y);
            doc.text(apellido, x + 40, y);
            doc.text(motivo, x + 80, y);
            doc.text(turno, x + 120, y);
            y += 10;

            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });
    }

    y += 20;

    // Llegadas Tarde / Se Retiró Temprano
    doc.setFont('helvetica', 'bold');
    doc.text("Llegadas Tarde / Se Retiró Temprano", x, y);
    y += 10;

    const llegadas = document.querySelectorAll('.llegadas-row');
    if (llegadas.length === 0) {
        doc.setFont('helvetica', 'normal');
        doc.text("No hay datos de llegadas tarde o retiros tempranos.", x, y);
        y += 10;
    } else {
        // Títulos de las columnas
        doc.setFont('helvetica', 'bold');
        doc.text("Tipo", x, y);
        doc.text("Nombre", x + 30, y);
        doc.text("Apellido", x + 70, y);
        doc.text("Motivo", x + 110, y);
        doc.text("Hora", x + 150, y);
        y += 10;

        // Datos de llegadas tarde / retiros tempranos
        doc.setFont('helvetica', 'normal');
        llegadas.forEach((row) => {
            const tipo = row.querySelector('select[name="tipo-llegadas"]').value || '';
            const nombre = row.querySelector('input[name="nombre-llegadas"]').value || '';
            const apellido = row.querySelector('input[name="apellido-llegadas"]').value || '';
            const motivo = row.querySelector('input[name="motivo-llegadas"]').value || '';
            const hora = row.querySelector('input[name="hora-llegadas"]').value || '';

            doc.text(tipo, x, y);
            doc.text(nombre, x + 30, y);
            doc.text(apellido, x + 70, y);
            doc.text(motivo, x + 110, y);
            doc.text(hora, x + 150, y);
            y += 10;

            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });
    }

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

        contenido += `<p><strong>Docente ${index + 1}:</strong><br>
            Docente: ${docente}<br>
            Materia: ${materia}<br>
            Grado: ${grado}<br>
            Turno: ${turno}<br>
            Módulos: ${modulos}<br>
            Motivo: ${motivo}</p>`;
    });

    // Personal de Cargo
    document.querySelectorAll('.cargo-row').forEach((row, index) => {
        const nombre = row.querySelector('input[name="nombre-cargo"]').value;
        const apellido = row.querySelector('input[name="apellido-cargo"]').value;
        const funcion = row.querySelector('input[name="funcion-cargo"]').value;
        const turno = row.querySelector('input[name="turno-cargo"]').value;

        contenido += `<p><strong>Personal de Cargo ${index + 1}:</strong><br>
            Nombre: ${nombre} ${apellido}<br>
            Función: ${funcion}<br>
            Turno: ${turno}</p>`;
    });

    // Personal Auxiliar
    document.querySelectorAll('.auxiliar-row').forEach((row, index) => {
        const nombre = row.querySelector('input[name="nombre-auxiliar"]').value;
        const apellido = row.querySelector('input[name="apellido-auxiliar"]').value;
        const motivo = row.querySelector('input[name="motivo-auxiliar"]').value;
        const turno = row.querySelector('input[name="turno-auxiliar"]').value;

        contenido += `<p><strong>Personal Auxiliar ${index + 1}:</strong><br>
            Nombre: ${nombre} ${apellido}<br>
            Motivo: ${motivo}<br>
            Turno: ${turno}</p>`;
    });

    // Llegadas Tarde / Se Retiró Temprano
    document.querySelectorAll('.llegadas-row').forEach((row, index) => {
        const tipo = row.querySelector('select[name="tipo-llegadas"]').value;
        const nombre = row.querySelector('input[name="nombre-llegadas"]').value;
        const apellido = row.querySelector('input[name="apellido-llegadas"]').value;
        const motivo = row.querySelector('input[name="motivo-llegadas"]').value;
        const hora = row.querySelector('input[name="hora-llegadas"]').value;

        contenido += `<p><strong>Llegada Tarde / Retiro Temprano ${index + 1}:</strong><br>
            Tipo: ${tipo}<br>
            Nombre: ${nombre} ${apellido}<br>
            Motivo: ${motivo}<br>
            Hora: ${hora}</p>`;
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
                    <option value="1ro 2da">1ro 2da</option>
                    <option value="1ro 3ra">1ro 3ra</option>
                    <option value="2do 1ra">2do 1ra</option>
                    <option value="2do 2da">2do 2da</option>
                    <option value="2do 3ra">2do 3ra</option>
                    <option value="3ro 1ra">3ro 1ra</option>
                    <option value="3ro 2da">3ro 2da</option>
                     <option value="3ro 3ra">3ro 3ra</option>
                    <option value="4to 1ra">4to 1ra</option>
                    <option value="4to 2da">4to 2da</option>
                    <option value="5to 1ra">5to 1ra</option>
                    <option value="5to 2da">5to 2da</option>
                    <option value="6to 1ra">6to 1ra</option>
                    <option value="6to 2da">6to 2da</option>
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

    // Evento para agregar nuevo personal de cargo
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

    // Evento para agregar nuevo personal auxiliar
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

    // Evento para agregar nueva llegada tarde / retiro temprano
    document.getElementById('add-llegadas').addEventListener('click', function() {
        let container = document.getElementById('llegadas-container');

        let newLlegadasRow = document.createElement('div');
        newLlegadasRow.classList.add('row', 'mb-3', 'llegadas-row');

        newLlegadasRow.innerHTML = `
            <div class="col-md-3">
                <select class="form-select" name="tipo-llegadas">
                    <option value="" selected disabled>Seleccione el Tipo</option>
                    <option value="Docente">Docente</option>
                    <option value="Personal de Cargo">Personal de Cargo</option>
                    <option value="Personal Auxiliar">Personal Auxiliar</option>
                </select>
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control" name="nombre-llegadas" placeholder="Nombre">
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control" name="apellido-llegadas" placeholder="Apellido">
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control" name="motivo-llegadas" placeholder="Motivo">
            </div>
            <div class="col-md-3">
                <input type="time" class="form-control" name="hora-llegadas" placeholder="Hora">
            </div>
        `;
        container.appendChild(newLlegadasRow);
    });
});

