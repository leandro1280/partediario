function generarPDF() {
    // Verificar si la librería jsPDF está cargada
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
        alert("No se pudo cargar la librería jsPDF.");
        return;
    }

    // Crear un nuevo documento PDF
    var doc = new jsPDF('portrait', 'pt', 'a4');

    // Obtener los datos del formulario
    var dia = document.getElementById('dia').value;
    if (!dia) {
        alert("Por favor, ingrese el día antes de generar el PDF.");
        return;
    }

    let establecimiento = document.getElementById('establecimiento').value;
    let mes = document.getElementById('mes').value;
    let senior = document.getElementById('senior').value;

    let x = 40;
    let y = 40;

    // Añadir contenido al PDF
    doc.setFontSize(14);
    doc.text("PARTE DIARIO GENERAL Nº", x, y);
    y += 30;
    doc.setFontSize(12);
    doc.text("Establecimiento: " + establecimiento, x, y);
    doc.text("Día: " + dia + " Mes: " + mes, x + 250, y);
    y += 20;
    doc.text("Señor/a: " + senior, x, y);

    // Generar el PDF y descargarlo
    doc.save(`parte-diario-${dia}.pdf`);
}
