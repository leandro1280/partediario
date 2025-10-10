// functions.js

// Función para cargar imagen y convertirla a base64
function cargarImagenComoBase64(url, callback) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        callback(dataURL);
    };
    img.onerror = function() {
        console.log('Error cargando la imagen');
        callback(null);
    };
    img.src = url;
}

// Función auxiliar para dividir texto en líneas que caben en el ancho de columna
function dividirTexto(doc, texto, anchoMaximo) {
    if (!texto) return [''];
    
    const palabras = texto.toString().split(' ');
    const lineas = [];
    let lineaActual = '';
    
    palabras.forEach(palabra => {
        const testLinea = lineaActual + (lineaActual ? ' ' : '') + palabra;
        if (doc.getTextWidth(testLinea) <= anchoMaximo - 4) { // -4 para margen
            lineaActual = testLinea;
        } else {
            if (lineaActual) {
                lineas.push(lineaActual);
                lineaActual = palabra;
            } else {
                // Si una palabra es muy larga, la cortamos
                lineas.push(palabra.substring(0, Math.floor(anchoMaximo / 3)));
                lineaActual = '';
            }
        }
    });
    
    if (lineaActual) {
        lineas.push(lineaActual);
    }
    
    return lineas.length > 0 ? lineas : [''];
}

// Función auxiliar para dibujar una tabla con bordes optimizada para B&N y manejo de páginas múltiples
function dibujarTabla(doc, x, y, headers, data, columnWidths) {
    const baseRowHeight = 8;
    const headerHeight = 10;
    const padding = 2;
    const maxY = 280; // Altura máxima antes de nueva página
    
    // Verificar si necesitamos una nueva página antes de empezar
    if (y > maxY - 50) { // Dejar margen de 50pt
        doc.addPage();
        y = 20;
    }
    
    // Dibujar encabezados con fondo gris para B&N
    doc.setFillColor(100, 100, 100); // Gris oscuro para B&N
    doc.rect(x, y, columnWidths.reduce((a, b) => a + b, 0), headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    
    let currentX = x;
    headers.forEach((header, index) => {
        doc.text(header, currentX + padding, y + 6);
        currentX += columnWidths[index];
    });
    
    // Resetear color
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8); // Fuente más pequeña para mejor ajuste
    
    // Calcular altura de cada fila basada en el contenido
    const alturasFilas = data.map((row, rowIndex) => {
        let maxAltura = baseRowHeight;
        row.forEach((cell, cellIndex) => {
            const lineas = dividirTexto(doc, cell, columnWidths[cellIndex]);
            const alturaNecesaria = lineas.length * 4; // 4pt por línea
            maxAltura = Math.max(maxAltura, alturaNecesaria);
        });
        return maxAltura;
    });
    
    // Dibujar datos con verificación de páginas múltiples
    data.forEach((row, rowIndex) => {
        const alturaFila = alturasFilas[rowIndex];
        const currentY = y + headerHeight + alturasFilas.slice(0, rowIndex).reduce((a, b) => a + b, 0);
        
        // Verificar si necesitamos nueva página antes de dibujar esta fila
        if (currentY + alturaFila > maxY) {
            doc.addPage();
            y = 20;
            
            // Redibujar encabezados en la nueva página
            doc.setFillColor(100, 100, 100);
            doc.rect(x, y, columnWidths.reduce((a, b) => a + b, 0), headerHeight, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            
            currentX = x;
            headers.forEach((header, index) => {
                doc.text(header, currentX + padding, y + 6);
                currentX += columnWidths[index];
            });
            
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
        }
        
        // Alternar color de fondo para filas (gris muy claro para B&N)
        if (rowIndex % 2 === 0) {
            doc.setFillColor(240, 240, 240);
            doc.rect(x, currentY, columnWidths.reduce((a, b) => a + b, 0), alturaFila, 'F');
        }
        
        currentX = x;
        row.forEach((cell, cellIndex) => {
            const lineas = dividirTexto(doc, cell, columnWidths[cellIndex]);
            lineas.forEach((linea, lineaIndex) => {
                doc.text(linea, currentX + padding, currentY + 5 + (lineaIndex * 4));
            });
            currentX += columnWidths[cellIndex];
        });
    });
    
    // Dibujar bordes de la tabla
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    
    const alturaTotal = headerHeight + alturasFilas.reduce((a, b) => a + b, 0);
    
    // Bordes verticales
    currentX = x;
    for (let i = 0; i <= columnWidths.length; i++) {
        doc.line(currentX, y, currentX, y + alturaTotal);
        if (i < columnWidths.length) currentX += columnWidths[i];
    }
    
    // Bordes horizontales
    doc.line(x, y, x + columnWidths.reduce((a, b) => a + b, 0), y); // Superior
    doc.line(x, y + headerHeight, x + columnWidths.reduce((a, b) => a + b, 0), y + headerHeight); // Debajo del header
    
    // Líneas entre filas
    let currentY = y + headerHeight;
    alturasFilas.forEach(altura => {
        currentY += altura;
        doc.line(x, currentY, x + columnWidths.reduce((a, b) => a + b, 0), currentY);
    });
    
    return y + alturaTotal + 10;
}

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
    } else if (["1ro 2da", "1ro 3ra", "2do 2da", "2do 3ra", "3ro 2da", "3ro 3ra"].includes(grado)) {
        turno = 'Tarde';
    } else if (["4to 2da", "5to 1ra", "6to 1ra"].includes(grado)) {
        turno = 'Vespertino';
    }

    // Buscar el input de turno en la misma fila
    const row = selectElement.closest('.docente-row');
    if (row) {
        const turnoInput = row.querySelector('input[name="turno"]');
        if (turnoInput) {
            turnoInput.value = turno;
        }
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
    let x = 20;
    let y = 40; // Ajustado para dejar espacio al logo

    // Agregar logo al PDF y generar contenido
    const img = new Image();
    
    img.onload = function() {
        try {
            // Crear un canvas para convertir la imagen a base64
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            
            // Agregar el logo al PDF (el logo ya contiene toda la información institucional)
            doc.addImage(dataURL, 'PNG', 15, 5, 50, 30);
            
            // Solo agregar información específica de la escuela
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0); // Negro
            doc.text("Escuela Primaria N° 54", 70, 35);
            doc.text("La Plata - Buenos Aires", 70, 40);
        } catch (e) {
            console.log("Error agregando logo:", e);
            // Fallback sin logo - mostrar información institucional completa
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 139); // Azul oscuro
            doc.text("DIRECCIÓN GENERAL DE CULTURA Y EDUCACIÓN", 20, 12);
            doc.text("GOBIERNO DE LA PROVINCIA DE", 20, 18);
            doc.text("BUENOS AIRES", 20, 24);
            
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0); // Negro
            doc.text("Escuela Primaria N° 54", 20, 32);
            doc.text("La Plata - Buenos Aires", 20, 37);
        }
        
        // Generar el resto del contenido del PDF
        generarContenidoPDF();
    };
    
    img.onerror = function() {
        console.log("No se pudo cargar el logo, usando solo texto");
        // Fallback sin logo - mostrar información institucional completa
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 139); // Azul oscuro
        doc.text("DIRECCIÓN GENERAL DE CULTURA Y EDUCACIÓN", 20, 12);
        doc.text("GOBIERNO DE LA PROVINCIA DE", 20, 18);
        doc.text("BUENOS AIRES", 20, 24);
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0); // Negro
        doc.text("Escuela Primaria N° 54", 20, 32);
        doc.text("La Plata - Buenos Aires", 20, 37);
        
        // Generar el resto del contenido del PDF
        generarContenidoPDF();
    };
    
    // Intentar cargar la imagen
    img.src = 'logoa.png';
    
    // Función para generar el contenido del PDF
    function generarContenidoPDF() {
        // Obtener los datos del formulario
        const fecha = document.getElementById('fecha').value;
        if (!fecha) {
            alert("Por favor, ingrese la fecha antes de generar el PDF.");
            return;
        }
        const diaSemana = document.getElementById('dia-semana').value;
        const establecimiento = document.getElementById('establecimiento').value;

        // Información del Establecimiento y Fecha con mejor diseño
        doc.setFillColor(240, 240, 240);
        doc.rect(15, y - 8, 180, 30, 'F');
        
        // Título principal
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 139); // Azul oscuro
        doc.text("PARTE DIARIO GENERAL", 20, y + 5);
        
        // Información de la escuela
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0); // Negro
        doc.text(`Establecimiento: ${establecimiento}`, x, y + 12);
        doc.text(`Fecha: ${fecha}`, x, y + 18);
        doc.text(`Día de la Semana: ${diaSemana}`, x, y + 24);
        y += 40;

        // Novedades del Personal - Docentes
        doc.setFillColor(0, 0, 139); // Azul oscuro
        doc.rect(15, y - 3, 180, 12, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255); // Blanco
        doc.text("NOVEDADES DEL PERSONAL - DOCENTES", 20, y + 4);
        y += 20;

        // Verificar si hay datos de docentes
        const docentes = document.querySelectorAll('.docente-row');
        if (docentes.length === 0) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text("No hay datos de docentes.", x, y);
            y += 15;
        } else {
            // Preparar datos para la tabla
            const headers = ['Docente', 'Materia', 'Grado', 'Turno', 'Módulos', 'Motivo'];
            const columnWidths = [35, 30, 25, 20, 15, 35];
            const data = [];
            
            docentes.forEach((row) => {
                const docenteInput = row.querySelector('input[name="docente"]');
                const materiaInput = row.querySelector('input[name="materia"]');
                const gradoSelect = row.querySelector('select[name="grado"]');
                const turnoInput = row.querySelector('input[name="turno"]');
                const modulosInput = row.querySelector('input[name="modulos"]');
                const motivoInput = row.querySelector('input[name="motivo-docente"]');
                
                const docente = docenteInput ? docenteInput.value : '';
                const materia = materiaInput ? materiaInput.value : '';
                const grado = gradoSelect ? gradoSelect.value : '';
                const turno = turnoInput ? turnoInput.value : '';
                const modulos = modulosInput ? modulosInput.value : '';
                const motivo = motivoInput ? motivoInput.value : '';
                
                data.push([docente, materia, grado, turno, modulos, motivo]);
            });
            
            // Dibujar tabla
            y = dibujarTabla(doc, x, y, headers, data, columnWidths);
            
            // Verificar si hay que agregar una nueva página
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
        }

        // Verificar espacio para nueva sección
        if (y > 250) {
            doc.addPage();
            y = 20;
        }

        // Personal de Cargo
        doc.setFillColor(0, 0, 139); // Azul oscuro
        doc.rect(15, y - 3, 180, 12, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255); // Blanco
        doc.text("PERSONAL DE CARGO", 20, y + 4);
        y += 20;

        const cargos = document.querySelectorAll('.cargo-row');
        if (cargos.length === 0) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text("No hay datos de personal de cargo.", x, y);
            y += 15;
        } else {
            // Preparar datos para la tabla
            const headers = ['Nombre', 'Apellido', 'Función', 'Motivo'];
            const columnWidths = [40, 40, 50, 50];
            const data = [];
            
            cargos.forEach((row) => {
                const nombreInput = row.querySelector('input[name="nombre-cargo"]');
                const apellidoInput = row.querySelector('input[name="apellido-cargo"]');
                const funcionInput = row.querySelector('input[name="funcion-cargo"]');
                const motivoInput = row.querySelector('input[name="motivo-cargo"]');
                
                const nombre = nombreInput ? nombreInput.value : '';
                const apellido = apellidoInput ? apellidoInput.value : '';
                const funcion = funcionInput ? funcionInput.value : '';
                const motivo = motivoInput ? motivoInput.value : '';
                
                data.push([nombre, apellido, funcion, motivo]);
            });
            
            // Dibujar tabla
            y = dibujarTabla(doc, x, y, headers, data, columnWidths);
            
            // Verificar si hay que agregar una nueva página
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
        }

        // Verificar espacio para nueva sección
        if (y > 250) {
            doc.addPage();
            y = 20;
        }

        // Personal Auxiliar
        doc.setFillColor(0, 0, 139); // Azul oscuro
        doc.rect(15, y - 3, 180, 12, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255); // Blanco
        doc.text("PERSONAL AUXILIAR", 20, y + 4);
        y += 20;

        const auxiliares = document.querySelectorAll('.auxiliar-row');
        if (auxiliares.length === 0) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text("No hay datos de personal auxiliar.", x, y);
            y += 15;
        } else {
            // Preparar datos para la tabla
            const headers = ['Nombre', 'Apellido', 'Motivo', 'Turno'];
            const columnWidths = [40, 40, 60, 40];
            const data = [];
            
            auxiliares.forEach((row) => {
                const nombreInput = row.querySelector('input[name="nombre-auxiliar"]');
                const apellidoInput = row.querySelector('input[name="apellido-auxiliar"]');
                const motivoInput = row.querySelector('input[name="motivo-auxiliar"]');
                const turnoInput = row.querySelector('input[name="turno-auxiliar"]');
                
                const nombre = nombreInput ? nombreInput.value : '';
                const apellido = apellidoInput ? apellidoInput.value : '';
                const motivo = motivoInput ? motivoInput.value : '';
                const turno = turnoInput ? turnoInput.value : '';
                
                data.push([nombre, apellido, motivo, turno]);
            });
            
            // Dibujar tabla
            y = dibujarTabla(doc, x, y, headers, data, columnWidths);
            
            // Verificar si hay que agregar una nueva página
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
        }

        // Verificar espacio para nueva sección
        if (y > 250) {
            doc.addPage();
            y = 20;
        }

        // Llegadas Tarde / Se Retiró Temprano
        doc.setFillColor(0, 0, 139); // Azul oscuro
        doc.rect(15, y - 3, 180, 12, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255); // Blanco
        doc.text("LLEGADAS TARDE / SE RETIRÓ TEMPRANO", 20, y + 4);
        y += 20;

        const llegadas = document.querySelectorAll('.llegadas-row');
        if (llegadas.length === 0) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text("No hay datos de llegadas tarde o retiros tempranos.", x, y);
            y += 15;
        } else {
            // Preparar datos para la tabla
            const headers = ['Tipo', 'Nombre', 'Apellido', 'Motivo', 'Hora'];
            const columnWidths = [30, 35, 35, 50, 20];
            const data = [];
            
            llegadas.forEach((row) => {
                const tipoSelect = row.querySelector('select[name="tipo-llegadas"]');
                const nombreInput = row.querySelector('input[name="nombre-llegadas"]');
                const apellidoInput = row.querySelector('input[name="apellido-llegadas"]');
                const motivoInput = row.querySelector('input[name="motivo-llegadas"]');
                const horaInput = row.querySelector('input[name="hora-llegadas"]');
                
                const tipo = tipoSelect ? tipoSelect.value : '';
                const nombre = nombreInput ? nombreInput.value : '';
                const apellido = apellidoInput ? apellidoInput.value : '';
                const motivo = motivoInput ? motivoInput.value : '';
                const hora = horaInput ? horaInput.value : '';
                
                data.push([tipo, nombre, apellido, motivo, hora]);
            });
            
            // Dibujar tabla
            y = dibujarTabla(doc, x, y, headers, data, columnWidths);
        }

        // Descargar el PDF con el nombre personalizado con la fecha
        doc.save(`parte-diario-${fecha}.pdf`);
    }
}

// Función para actualizar la vista previa de los datos ingresados
function actualizarVistaPrevia() {
    const vistaPrevia = document.getElementById('vista-previa');
    if (!vistaPrevia) return;
    
    let contenido = '';

    // Recorrer las filas de docentes y agregar sus datos
    document.querySelectorAll('.docente-row').forEach((row, index) => {
        const docenteInput = row.querySelector('input[name="docente"]');
        const materiaInput = row.querySelector('input[name="materia"]');
        const gradoSelect = row.querySelector('select[name="grado"]');
        const turnoInput = row.querySelector('input[name="turno"]');
        const modulosInput = row.querySelector('input[name="modulos"]');
        const motivoInput = row.querySelector('input[name="motivo-docente"]');
        
        const docente = docenteInput ? docenteInput.value : '';
        const materia = materiaInput ? materiaInput.value : '';
        const grado = gradoSelect ? gradoSelect.value : '';
        const turno = turnoInput ? turnoInput.value : '';
        const modulos = modulosInput ? modulosInput.value : '';
        const motivo = motivoInput ? motivoInput.value : '';

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
        const nombreInput = row.querySelector('input[name="nombre-cargo"]');
        const apellidoInput = row.querySelector('input[name="apellido-cargo"]');
        const funcionInput = row.querySelector('input[name="funcion-cargo"]');
        const motivoInput = row.querySelector('input[name="motivo-cargo"]');
        
        const nombre = nombreInput ? nombreInput.value : '';
        const apellido = apellidoInput ? apellidoInput.value : '';
        const funcion = funcionInput ? funcionInput.value : '';
        const motivo = motivoInput ? motivoInput.value : '';

        contenido += `<p><strong>Personal de Cargo ${index + 1}:</strong><br>
            Nombre: ${nombre} ${apellido}<br>
            Función: ${funcion}<br>
            Motivo: ${motivo}</p>`;
    });

    // Personal Auxiliar
    document.querySelectorAll('.auxiliar-row').forEach((row, index) => {
        const nombreInput = row.querySelector('input[name="nombre-auxiliar"]');
        const apellidoInput = row.querySelector('input[name="apellido-auxiliar"]');
        const motivoInput = row.querySelector('input[name="motivo-auxiliar"]');
        const turnoInput = row.querySelector('input[name="turno-auxiliar"]');
        
        const nombre = nombreInput ? nombreInput.value : '';
        const apellido = apellidoInput ? apellidoInput.value : '';
        const motivo = motivoInput ? motivoInput.value : '';
        const turno = turnoInput ? turnoInput.value : '';

        contenido += `<p><strong>Personal Auxiliar ${index + 1}:</strong><br>
            Nombre: ${nombre} ${apellido}<br>
            Motivo: ${motivo}<br>
            Turno: ${turno}</p>`;
    });

    // Llegadas Tarde / Se Retiró Temprano
    document.querySelectorAll('.llegadas-row').forEach((row, index) => {
        const tipoSelect = row.querySelector('select[name="tipo-llegadas"]');
        const nombreInput = row.querySelector('input[name="nombre-llegadas"]');
        const apellidoInput = row.querySelector('input[name="apellido-llegadas"]');
        const motivoInput = row.querySelector('input[name="motivo-llegadas"]');
        const horaInput = row.querySelector('input[name="hora-llegadas"]');
        
        const tipo = tipoSelect ? tipoSelect.value : '';
        const nombre = nombreInput ? nombreInput.value : '';
        const apellido = apellidoInput ? apellidoInput.value : '';
        const motivo = motivoInput ? motivoInput.value : '';
        const hora = horaInput ? horaInput.value : '';

        contenido += `<p><strong>Llegada Tarde / Retiro Temprano ${index + 1}:</strong><br>
            Tipo: ${tipo}<br>
            Nombre: ${nombre} ${apellido}<br>
            Motivo: ${motivo}<br>
            Hora: ${hora}</p>`;
    });

    vistaPrevia.innerHTML = contenido;
}

// Versión actualizada - 2024-01-10 - Error corregido

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
                <input type="text" class="form-control" name="motivo-cargo" placeholder="Motivo">
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

