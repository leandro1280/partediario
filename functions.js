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
    doc.setFontSize(18);
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
        let grado = row.querySelector('input[name="grado"]').value;
        let turno = row.querySelector('input[name="turno"]').value;
        let modulos = row.querySelector('input[name="modulos"]').value;
        let motivo = row.querySelector('input[name="motivo-docente"]').value;

        doc.text(`Docente: ${docente} | Materia: ${materia} | Grado: ${grado} | Turno: ${turno} | Módulos: ${modulos} | Motivo: ${motivo}`, x, y);
        y += 20;
    });

    // Descargar el PDF con el nombre personalizado con la fecha
    doc.save(`parte-diario-${fecha}.pdf`);
}

// Función para autocompletar el turno basado en el grado
function actualizarTurno(input) {
    const grado = input.value.toLowerCase();
    let turno = '';

    if (["1ro 1ra", "2do 1ra", "3ro primera", "4to 1ra", "5to", "6to 2da"].includes(grado)) {
        turno = 'Mañana';
    } else if (["1ro 2da", "1ro 3ra", "2do 2da", "2do 3ra", "3ro 2da"].includes(grado)) {
        turno = 'Tarde';
    } else if (["4to 2da", "5to 1ra", "6to 1ra"].includes(grado)) {
        turno = 'Vespertino';
    }

    input.closest('.docente-row').querySelector('input[name="turno"]').value = turno;
}
