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
    doc.text(`Establecimiento: ${establecimiento}`, x, y);
    doc.text(`Fecha: ${fecha}`, x + 250, y);
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

        if (docente && materia && grado && turno && modulos) {
            doc.text(`Docente: ${docente} | Materia: ${materia} | Grado: ${grado} | Turno: ${turno} | Módulos: ${modulos} | Motivo: ${motivo}`, x, y);
            y += 20;
        }
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

        if (nombre && apellido && funcion && turno) {
            doc.text(`Nombre: ${nombre} ${apellido} | Función: ${funcion} | Turno: ${turno}`, x, y);
            y += 20;
        }
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
        let motivo = row.querySelector('input[name="motivo-auxiliar"]').value;
        let turno = row.querySelector('input[name="turno-auxiliar"]').value;

        if (nombre && apellido && motivo && turno) {
            doc.text(`Nombre: ${nombre} ${apellido} | Motivo: ${motivo} | Turno: ${turno}`, x, y);
            y += 20;
        }
    });

    // Descargar el PDF con el nombre personalizado con la fecha
    doc.save(`parte-diario-${fecha}.pdf`);
}

});
