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
        alert("No se pudo cargar la librería jsPDF.");
        return;
    }

    // Crear un nuevo documento PDF
    var doc = new jsPDF('portrait', 'pt', 'a4');

    // Definir posición inicial
    let x = 40;
    let y = 40;

    // Título principal
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("PARTE DIARIO GENERAL Nº", x, y);
    y += 40;

    // Obtener los datos del formulario
    var fecha = document.getElementById('fecha').value;
    if (!fecha) {
        alert("Por favor, ingrese la fecha antes de generar el PDF.");
        return;
    }

    let establecimiento = document.getElementById('establecimiento').value;

    // Información del Establecimiento y Fecha
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(Establecimiento: ${establecimiento}, x, y);
    doc.text(Fecha: ${fecha}, x + 250, y);
    y += 30;

    // Docentes
    doc.setFont('helvetica', 'bold');
    doc.text("Novedades del Personal - Docentes", x, y);
    y += 20;
    doc.setFont('helvetica', 'normal');

    document.querySelectorAll('.docente-row').forEach((row) => {
        let docente = row.querySelector('input[name="docente"]').value;
        let materia = row.querySelector('input[name="materia"]').value;
        let grado = row.querySelector('select[name="grado"]').value;
        let turno = row.querySelector('input[name="turno"]').value;
        let modulos = row.querySelector('input[name="modulos"]').value;
        let motivo = row.querySelector('input[name="motivo-docente"]').value;

        doc.text(Docente: ${docente} | Materia: ${materia} | Grado: ${grado} | Turno: ${turno} | Módulos: ${modulos} | Motivo: ${motivo}, x, y);
        y += 20;
    });

    // Descargar el PDF con el nombre personalizado con la fecha
    doc.save(parte-diario-${fecha}.pdf);
}

// Función para autocompletar el turno basado en el grado seleccionado
function actualizarTurno(select) {
    const grado = select.value.toLowerCase();
    let turno = '';

    // Definir el turno en base al grado seleccionado
    if (["1ro 1ra", "2do 1ra", "3ro primera", "4to 1ra", "5to 1ra", "6to 2da"].includes(grado)) {
        turno = 'Mañana';
    } else if (["1ro 2da", "1ro 3ra", "2do 2da", "2do 3ra", "3ro 2da"].includes(grado)) {
        turno = 'Tarde';
    } else if (["4to 2da", "5to 1ra", "6to 1ra"].includes(grado)) {
        turno = 'Vespertino';
    }

    // Actualizar el valor del campo de turno
    select.closest('.docente-row').querySelector('input[name="turno"]').value = turno;
}

// Función para mostrar el día de la semana al seleccionar una fecha
function mostrarDiaSemana() {
    const fecha = new Date(document.getElementById('fecha').value);
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaSemana = diasSemana[fecha.getUTCDay()];
    document.getElementById('dia-semana').value = diaSemana;
}

// Función para agregar nuevos campos de docentes, personal de cargo y personal auxiliar
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('add-docente').addEventListener('click', function() {
        let container = document.getElementById('docente-container');
        let newDocenteRow = document.createElement('div');
        newDocenteRow.classList.add('row', 'mb-3', 'docente-row');
        newDocenteRow.innerHTML = 
            <div class="col-md-2">
                <label for="docente" class="form-label">Docente</label>
                <input type="text" class="form-control" name="docente" placeholder="Apellido y Nombre">
            </div>
            <div class="col-md-2">
                <label for="materia" class="form-label">Materia</label>
                <input type="text" class="form-control" name="materia" placeholder="Materia">
            </div>
            <div class="col-md-2">
                <label for="grado" class="form-label">Grado</label>
                <select class="form-select" name="grado" onchange="actualizarTurno(this)">
                    <option value="" selected disabled>Seleccione el Grado</option>
                    <option value="1ro 1ra">1ro 1ra</option>
                    <option value="1ro 2da">1ro 2da</option>
                    <option value="1ro 3ra">1ro 3ra</option>
                    <option value="2do 1ra">2do 1ra</option>
                    <option value="2do 2da">2do 2da</option>
                    <option value="2do 3ra">2do 3ra</option>
                    <option value="3ro primera">3ro primera</option>
                    <option value="3ro 2da">3ro 2da</option>
                    <option value="4to 1ra">4to 1ra</option>
                    <option value="4to 2da">4to 2da</option>
                    <option value="5to 1ra">5to 1ra</option>
                    <option value="6to 1ra">6to 1ra</option>
                    <option value="6to 2da">6to 2da</option>
                </select>
            </div>
            <div class="col-md-2">
                <label for="turno" class="form-label">Turno</label>
                <input type="text" class="form-control" name="turno" placeholder="Turno" readonly>
            </div>
            <div class="col-md-2">
                <label for="modulos" class="form-label">Módulos</label>
                <input type="number" class="form-control" name="modulos" placeholder="Cantidad">
            </div>
            <div class="col-md-2">
                <label for="motivo" class="form-label">Motivo</label>
                <input type="text" class="form-control" name="motivo-docente" placeholder="Motivo">
            </div>
        ;
        container.appendChild(newDocenteRow);
    });

    document.getElementById('add-cargo').addEventListener('click', function() {
        let container = document.getElementById('cargo-container');
        let newCargoRow = document.createElement('div');
        newCargoRow.classList.add('row', 'mb-3', 'cargo-row');
        newCargoRow.innerHTML = 
            <div class="col-md-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control" name="nombre-cargo" placeholder="Nombre">
            </div>
            <div class="col-md-3">
                <label for="apellido" class="form-label">Apellido</label>
                <input type="text" class="form-control" name="apellido-cargo" placeholder="Apellido">
            </div>
            <div class="col-md-3">
                <label for="funcion" class="form-label">Función</label>
                <input type="text" class="form-control" name="funcion-cargo" placeholder="Función">
            </div>
            <div class="col-md-3">
                <label for="turno" class="form-label">Turno</label>
                <input type="text" class="form-control" name="turno-cargo" placeholder="Turno">
            </div>
        ;
        container.appendChild(newCargoRow);
    });

    document.getElementById('add-auxiliar').addEventListener('click', function() {
        let container = document.getElementById('auxiliar-container');
        let newAuxiliarRow = document.createElement('div');
        newAuxiliarRow.classList.add('row', 'mb-3', 'auxiliar-row');
        newAuxiliarRow.innerHTML = 
            <div class="col-md-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control" name="nombre-auxiliar" placeholder="Nombre">
            </div>
            <div class="col-md-3">
                <label for="apellido" class="form-label">Apellido</label>
                <input type="text" class="form-control" name="apellido-auxiliar" placeholder="Apellido">
            </div>
            <div class="col-md-3">
                <label for="motivo" class="form-label">Motivo</label>
                <input type="text" class="form-control" name="motivo-auxiliar" placeholder="Motivo">
            </div>
            <div class="col-md-3">
                <label for="turno" class="form-label">Turno</label>
                <input type="text" class="form-control" name="turno-auxiliar" placeholder="Turno">
            </div>
        ;
        container.appendChild(newAuxiliarRow);
    });
}); 
    // Descargar el PDF con el nombre personalizado con la fecha
    doc.save(`parte-diario-${fecha}.pdf`);
}

});
