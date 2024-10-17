var CLIENT_ID = '1068808819946-1260pdq2v329p9n6j7dhdvm4uokpsd10.apps.googleusercontent.com'; // Reemplaza con tu Client ID
var API_KEY = 'AIzaSyCInaRqjOSiTYftuncEHWDD1yNNaHov2tQ'; // Reemplaza con tu API Key

var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/drive.file";
var SCOPES = "https://www.googleapis.com/auth/drive";


/**
 * Carga el cliente de la API cuando se carga la página.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 * Inicializa el cliente de la API con la clave API y el Client ID.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }).catch(function (error) {
        console.error('Error en la inicialización de Google API', error);
    });
}

/**
 * Actualiza la interfaz de usuario cuando el estado de autenticación cambia.
 * Si el usuario está autenticado, puede interactuar con Google Drive.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        console.log("Autenticado en Google Drive.");
    } else {
        gapi.auth2.getAuthInstance().signIn();
    }
}

/**
 * Genera un PDF a partir de los datos ingresados en el formulario.
 */
function generarPDF() {
   

    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
        alert("No se pudo cargar la librería jsPDF.");
        return;
    }
    var doc = new jsPDF('portrait', 'pt', 'a4');
    var doc = new jsPDF('portrait', 'pt', 'a4');

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

    doc.setFontSize(14);
    doc.text("PARTE DIARIO GENERAL Nº", x, y);
    y += 30;
    doc.setFontSize(12);
    doc.text("Establecimiento: " + establecimiento, x, y);
    doc.text("Día: " + dia + " Mes: " + mes, x + 250, y);

    y += 20;
    doc.text("Señor/a: " + senior, x, y);

    var pdfBase64 = doc.output('datauristring').split(',')[1];
    uploadFileToDrive(pdfBase64, dia);
}

/**
 * Sube el archivo PDF generado a Google Drive.
 */
function uploadFileToDrive(pdfBase64, dia) {
    var boundary = '-------314159265358979323846';
    var delimiter = "\r\n--" + boundary + "\r\n";
    var close_delim = "\r\n--" + boundary + "--";

    var contentType = 'application/pdf';
    var metadata = {
        'name': `parte-diario-${dia}.pdf`,
        'mimeType': contentType
    };

    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        pdfBase64 +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v3/files',
        'method': 'POST',
        'params': { 'uploadType': 'multipart' },
        'headers': {
            'Content-Type': 'multipart/related; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody
    });

request.execute(function (file) {
    if (file.error) {
        console.error('Error al subir archivo:', file.error);
    } else {
        console.log('Archivo subido a Google Drive:', file);
        alert('Archivo guardado en Google Drive con éxito.');
    }
});

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
