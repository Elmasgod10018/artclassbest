const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// LLAVE MAESTRA: TU CORREO DE ADMINISTRADOR SUPREMO
const CORREO_ADMIN = "y.madrid10018@gmail.com"; 

let estudiantesRegistrados = new Set();
let listaNegra = new Set();

app.get('/', (req, res) => {
    res.render('index', { verContenido: false, mensaje: null, esAdmin: false });
});

// NUEVA RUTA NATIVA COMPATIBLE: Entrega el visor interno blindado sin usar archivos HTML sueltos
app.get('/gsites.html', (req, res) => {
    const targetUrl = req.query.url;
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Inici - Classroom</title>
            <link rel="icon" type="image/x-icon" href="https://gstatic.com">
            <style>
                html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #121212; }
                iframe { border: none; width: 100%; height: 100%; margin: 0; padding: 0; }
            </style>
        </head>
        <body>
            <iframe src="${targetUrl}" allow="fullscreen; autoplay"></iframe>
        </body>
        </html>
    `);
});

app.post('/acceder', (req, res) => {
    const email = req.body.email.trim().toLowerCase();

    if (listaNegra.has(email)) {
        return res.render('index', { verContenido: false, mensaje: "Acceso denegado. Has sido expulsado.", esAdmin: false });
    }

    if (email === CORREO_ADMIN.toLowerCase()) {
        return res.render('index', { verContenido: true, mensaje: "Consola de Administración Suprema Activada", esAdmin: true });
    }

    estudiantesRegistrados.add(email);
    res.render('index', { verContenido: true, mensaje: "Estudiante Verificado de Forma Permanente", esAdmin: false });
});

app.post('/admin-accion', (req, res) => {
    const emailTarget = req.body.emailTarget.trim().toLowerCase();
    const accion = req.body.accion;

    if (accion === "bloquear") {
        listaNegra.add(emailTarget);
        estudiantesRegistrados.delete(emailTarget);
    } else if (accion === "eliminar") {
        estudiantesRegistrados.delete(emailTarget);
        listaNegra.delete(emailTarget);
    }

    res.render('index', { verContenido: true, mensaje: `Usuario ${emailTarget} procesado (${accion}).`, esAdmin: true });
});

app.get('/salir', (req, res) => {
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Art Class corriendo en puerto ${PORT}`);
});
