const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// LLAVE MAESTRA: SÓLO TU CORREO TIENE PODER DE ADMINISTRADOR
const CORREO_ADMIN = "y.madrid10018@gmail.com"; 

// Listas en memoria para guardar los datos
let estudiantesRegistrados = new Set();
let listaNegra = new Set();

app.get('/', (req, res) => {
    res.render('index', { verContenido: false, mensaje: null, esAdmin: false });
});

app.post('/acceder', (req, res) => {
    const email = req.body.email.trim().toLowerCase();

    // 1. Validar si el correo está en tu lista negra
    if (listaNegra.has(email)) {
        return res.render('index', { verContenido: false, mensaje: "Acceso denegado. Has sido expulsado.", esAdmin: false });
    }

    // 2. Si eres tú, entras directo con la consola de borrado activada
    if (email === CORREO_ADMIN.toLowerCase()) {
        return res.render('index', { verContenido: true, mensaje: "Consola de Administración Suprema Activada", esAdmin: true });
    }

    // 3. Si es un alumno normal, se guarda en memoria y entra
    estudiantesRegistrados.add(email);
    res.render('index', { verContenido: true, mensaje: "Estudiante Verificado de Forma Permanente", esAdmin: false });
});

// Ruta de acción exclusiva para ti
app.post('/admin-accion', (req, res) => {
    const emailTarget = req.body.emailTarget.trim().toLowerCase();
    const accion = req.body.accion; // "bloquear" o "eliminar"

    if (accion === "bloquear") {
        listaNegra.add(emailTarget);
        estudiantesRegistrados.delete(emailTarget);
    } else if (accion === "eliminar") {
        estudiantesRegistrados.delete(emailTarget);
        listaNegra.delete(emailTarget); // Lo saca de la lista negra si estaba
    }

    // Te mantiene dentro de tu interfaz para que sigas gestionando
    res.render('index', { verContenido: true, mensaje: `El usuario ${emailTarget} fue procesado con éxito (${accion}).`, esAdmin: true });
});

app.get('/salir', (req, res) => {
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Art Class corriendo en puerto ${PORT}`);
});
