const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// AQUÍ CONFIGURAS TU CORREO DE JEFE/ADMINISTRADOR
const CORREO_ADMIN = "tu-correo-jefe@gmail.com"; 

// Listas en memoria
let estudiantesRegistrados = new Set();
let listaNegra = new Set();

app.get('/', (req, res) => {
    res.render('index', { verContenido: false, mensaje: null, esAdmin: false });
});

app.post('/acceder', (req, res) => {
    const email = req.body.email.trim().toLowerCase();

    if (listaNegra.has(email)) {
        return res.render('index', { verContenido: false, mensaje: "Acceso denegado. Has sido expulsado.", esAdmin: false });
    }

    if (email === CORREO_ADMIN.toLowerCase()) {
        return res.render('index', { verContenido: true, mensaje: "Panel de Administrador Activado", esAdmin: true });
    }

    // Si no está registrado, se guarda automáticamente para siempre
    estudiantesRegistrados.add(email);
    res.render('index', { verContenido: true, mensaje: "Estudiante Verificado de Forma Permanente", esAdmin: false });
});

// Ruta especial que te permite a ti expulsar o eliminar personas
app.post('/admin-accion', (req, res) => {
    const emailTarget = req.body.emailTarget.trim().toLowerCase();
    const accion = req.body.accion; // "bloquear" o "eliminar"

    if (accion === "bloquear") {
        listaNegra.add(emailTarget);
        estudiantesRegistrados.delete(emailTarget);
    } else if (accion === "eliminar") {
        estudiantesRegistrados.delete(emailTarget);
        listaNegra.delete(emailTarget); // Borrado total
    }

    // Regresa al modo administrador para seguir gestionando
    res.render('index', { verContenido: true, mensaje: `Usuario ${emailTarget} procesado con éxito (${accion}).`, esAdmin: true });
});

app.get('/salir', (req, res) => {
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
