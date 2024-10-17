// Función para generar y descargar el PDF
function generarPDF() {
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
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("PARTE DIARIO GENERAL Nº", x, y);
    y += 40;

    // Obtener los datos del formulario
    var dia = document.getElementById('dia').value;
    if (!dia) {
        alert("Por favor, ingrese el día antes de generar el PDF.");
        return;
    }

    let establecimiento = document.getElementById('establecimiento').value;
    let mes = document.getElementById('mes').value;
    let senior = document.getElementById('senior').value;

    // Información del Establecimiento y Fecha
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Establecimiento: ${establecimiento}`, x, y);
    doc.text(`Día: ${dia} Mes: ${mes}`, x + 250, y);
    y += 30;

    // Señor/a
    doc.text(`Señor/a: ${senior}`, x, y);
    y += 40;

    // Docentes
    doc.setFont('helvetica', 'bold');
    doc.text("Novedades del Personal - Docentes", x, y);
    y += 20;
    doc.setFont('helvetica', 'normal');

    document.querySelectorAll('.docente-row').forEach((row) => {
        let docente = row.querySelector('input[name="docente"]').value;
        let materia = row.querySelector('input[name="materia"]').value;
        let turno = row.querySelector('input[name="turno"]').value;
        let grado = row.querySelector('input[name="grado"]').value;

        doc.text(`Docente: ${docente} | Materia: ${materia} | Turno: ${turno} | Grado: ${grado}`, x, y);
        y += 20;
    });

    y += 20;

    // Personal de Cargo
    doc.setFont('helvetica', 'bold');
    doc.text("Personal de Cargo", x, y);
    y += 20;
    doc.setFont('helvetica', 'normal');

    document.querySelectorAll('.cargo-row').forEach((row) => {
        let nombre = row.querySelector('input[name="nombre-cargo"]').value;
        let apellido = row.querySelector('input[name="apellido-cargo"]').value;
        let funcion = row.querySelector('input[name="funcion-cargo"]').value;
        let turno = row.querySelector('input[name="turno-cargo"]').value;

        doc.text(`Nombre: ${nombre} ${apellido} | Función: ${funcion} | Turno: ${turno}`, x, y);
        y += 20;
    });

    y += 20;

    // Personal Auxiliar
    doc.setFont('helvetica', 'bold');
    doc.text("Personal Auxiliar", x, y);
    y += 20;
    doc.setFont('helvetica', 'normal');

    document.querySelectorAll('.auxiliar-row').forEach((row) => {
        let nombre = row.querySelector('input[name="nombre-auxiliar"]').value;
        let apellido = row.querySelector('input[name="apellido-auxiliar"]').value;
        let funcion = row.querySelector('input[name="funcion-auxiliar"]').value;
        let turno = row.querySelector('input[name="turno-auxiliar"]').value;

        doc.text(`Nombre: ${nombre} ${apellido} | Función: ${funcion} | Turno: ${turno}`, x, y);
        y += 20;
    });

    // Descargar el PDF
    doc.save(`parte-diario-${dia}.pdf`);
}

// Función para agregar nuevos campos de docentes, personal de cargo y personal auxiliar
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('add-docente').addEventListener('click', function() {
        let container = document.getElementById('docente-container');
        let newDocenteRow = document.createElement('div');
        newDocenteRow.classList.add('row', 'mb-3', 'docente-row');
        newDocenteRow.innerHTML = `
            <div class="col-md-3">
                <label for="docente" class="form-label">Docente</label>
                <input type="text" class="form-control" name="docente" placeholder="Apellido y Nombre">
            </div>
            <div class="col-md-2">
                <label for="materia" class="form-label">Materia</label>
                <input type="text" class="form-control" name="materia" placeholder="Materia">
            </div>
            <div class="col-md-2">
                <label for="turno" class="form-label">Turno</label>
                <input type="text" class="form-control" name="turno" placeholder="Turno">
            </div>
            <div class="col-md-2">
                <label for="grado" class="form-label">Grado</label>
                <input type="text" class="form-control" name="grado" placeholder="Grado">
            </div>
        `;
        container.appendChild(newDocenteRow);
    });

    document.getElementById('add-cargo').addEventListener('click', function() {
        let container = document.getElementById('cargo-container');
        let newCargoRow = document.createElement('div');
        newCargoRow.classList.add('row', 'mb-3', 'cargo-row');
        newCargoRow.innerHTML = `
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
        `;
        container.appendChild(newCargoRow);
    });

    document.getElementById('add-auxiliar').addEventListener('click', function() {
        let container = document.getElementById('auxiliar-container');
        let newAuxiliarRow = document.createElement('div');
        newAuxiliarRow.classList.add('row', 'mb-3', 'auxiliar-row');
        newAuxiliarRow.innerHTML = `
            <div class="col-md-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control" name="nombre-auxiliar" placeholder="Nombre">
            </div>
            <div class="col-md-3">
                <label for="apellido" class="form-label">Apellido</label>
                <input type="text" class="form-control" name="apellido-auxiliar" placeholder="Apellido">
            </div>
            <div class="col-md-3">
                <label for="funcion" class="form-label">Función</label>
                <input type="text" class="form-control" name="funcion-auxiliar" placeholder="Función">
            </div>
            <div class="col-md-3">
                <label for="turno" class="form-label">Turno</label>
                <input type="text" class="form-control" name="turno-auxiliar" placeholder="Turno">
            </div>
        `;
        container.appendChild(newAuxiliarRow);
    });
});
